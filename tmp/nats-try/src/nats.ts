import { NatsConnection, StringCodec, connect } from "nats";

abstract class MessageBroker {
  abstract connect: () => Promise<void>;
  abstract publish: (subject: string, payload: object) => Promise<void>;
  abstract subscribe: (
    subject: string,
    cb: (msg: unknown) => void
  ) => Promise<void>;
}

class NatsBroker implements MessageBroker {
  private url: string;
  private connection: NatsConnection | null = null;
  stringCodec = StringCodec();

  constructor(url: string) {
    this.url = url;
  }

  async connect() {
    this.connection = await connect({ servers: this.url });
  }

  async publish(subject: string, payload: object) {
    if (!this.connection) return;
    const enc = this.stringCodec.encode(JSON.stringify(payload));
    this.connection.publish(subject, enc);
  }

  async subscribe(subject: string, callback: (msg: string) => void) {
    if (!this.connection) return;
    const subscription = this.connection.subscribe(subject);
    for await (const message of subscription) {
      callback(this.stringCodec.decode(message.data));
    }
    await subscription.drain();
  }
}

export { NatsBroker };
