import {
  AckPolicy,
  DeliverPolicy,
  ErrorCode,
  JsMsg,
  NatsConnection,
  NatsError,
  StringCodec,
} from "nats";
import { Subject, Topic } from "./enum";

interface Event {
  topic: Topic;
  subject: Subject;
  data: object;
}

export abstract class Publisher<T extends Event> {
  abstract topic: T["topic"];
  abstract subject: T["subject"];
  private stringCodec = StringCodec();

  constructor(private client: NatsConnection) {}

  async init() {
    const jsm = await this.client.jetstreamManager();

    const stream = await jsm.streams.get(this.topic).catch(async (error) => {
      const isNotFound =
        (error as NatsError)?.code === ErrorCode.JetStream404NoMessages;
      if (isNotFound) {
        await jsm.streams.add({
          name: this.topic,
          subjects: [this.subject],
        });
      } else {
        console.error(error);
      }
    });

    if (stream) {
      const streamInfo = await stream.info();
      if (!streamInfo.config.subjects.includes(this.subject)) {
        streamInfo.config.subjects?.push(this.subject);
        await jsm.streams.update(this.topic, streamInfo.config);
      }
    }

    return this;
  }

  async publish(payload: T["data"]) {
    const js = this.client.jetstream();
    return js.publish(
      this.subject,
      this.stringCodec.encode(JSON.stringify(payload))
    );
  }
}

export abstract class Consumer<T extends Event> {
  abstract topic: T["topic"];
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract failRetryWaitMs: number;

  abstract onMessage(message: JsMsg, data: T["data"]): Promise<void>;

  constructor(private client: NatsConnection) {}

  async init() {
    const jsm = await this.client.jetstreamManager();
    await jsm.consumers.add(this.topic, {
      durable_name: this.queueGroupName,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      filter_subject: this.subject,
    });
    return this;
  }

  async consume() {
    const js = await this.client.jetstream();
    const consumer = await js.consumers.get(this.topic, this.queueGroupName);
    const messages = await consumer.consume();
    for await (const message of messages) {
      const decoded = message.json();
      try {
        await this.onMessage(message, decoded as T["data"]);
        message.ack();
      } catch (error) {
        console.error(
          `Error consume msg ${message.seq} with error: ${
            (error as Error).message
          } and payload ${JSON.stringify(decoded)}, retry in ${
            this.failRetryWaitMs
          }`
        );
        message.nak(this.failRetryWaitMs);
      }
    }
  }
}
