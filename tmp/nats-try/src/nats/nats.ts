import {
  NatsConnection,
  StringCodec,
  SubscriptionOptions,
  connect,
} from "nats";

class NatsBroker {
  private url: string;
  private nc: NatsConnection | null = null;
  stringCodec = StringCodec();

  constructor(url: string) {
    this.url = url;
  }

  async connect() {
    this.nc = await connect({ servers: this.url });
  }

  publish(subject: string, payload: object) {
    if (!this.nc) return;
    const enc = this.stringCodec.encode(JSON.stringify(payload));
    this.nc.publish(subject, enc);
  }

  async subscribe(
    subject: string,
    callback: (msg: string) => void,
    opts?: SubscriptionOptions
  ) {
    if (!this.nc) return;
    const subscription = this.nc.subscribe(subject, opts);
    for await (const message of subscription) {
      callback(this.stringCodec.decode(message.data));
    }
    await subscription.drain();
  }
}

export { NatsBroker };
