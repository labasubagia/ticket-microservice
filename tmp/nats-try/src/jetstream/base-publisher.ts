import type { NatsConnection, PubAck } from 'nats'
import { StringCodec } from 'nats'

import { StreamMaker } from './stream-maker'
import { type Event } from './types'

export abstract class Publisher<T extends Event> {
  abstract topic: T['topic']
  abstract subject: T['subject']
  private readonly stringCodec = StringCodec()

  private _client?: NatsConnection
  get client(): NatsConnection {
    if (this._client == null) {
      throw new Error('please call init() first')
    }
    return this._client
  }

  async init(client: NatsConnection): Promise<this> {
    this._client = client
    const streamMaker = new StreamMaker(client, this.topic, this.subject)
    await streamMaker.make()
    return this
  }

  async publish(payload: T['data']): Promise<PubAck> {
    const js = this.client.jetstream()
    console.log(`event published: ${this.topic}/${this.subject}`)
    return await js.publish(
      this.subject,
      this.stringCodec.encode(JSON.stringify(payload))
    )
  }
}
