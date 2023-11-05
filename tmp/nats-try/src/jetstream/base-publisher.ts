import { ErrorCode, NatsConnection, NatsError, StringCodec } from "nats";
import { Event } from "./types";

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
