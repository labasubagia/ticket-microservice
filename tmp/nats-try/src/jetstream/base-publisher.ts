import type { NatsConnection, NatsError, PubAck } from 'nats'
import { ErrorCode, StringCodec } from 'nats'

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

    const jsm = await this.client.jetstreamManager()

    // upsert stream
    await jsm?.streams
      .get(this.topic)
      .then(async (stream) => {
        const { config } = await stream.info()
        const hasSubject = config.subjects.includes(this.subject)
        if (hasSubject) {
          return
        }
        config.subjects?.push(this.subject)
        await jsm.streams.update(this.topic, config)
      })
      .catch(async (error) => {
        const isNotFound =
          (error as NatsError)?.code === ErrorCode.JetStream404NoMessages
        if (isNotFound) {
          await jsm.streams.add({ name: this.topic, subjects: [this.subject] })
          return
        }
        console.error(error)
      })

    return this
  }

  async publish(payload: T['data']): Promise<PubAck> {
    const js = this.client.jetstream()
    return await js.publish(
      this.subject,
      this.stringCodec.encode(JSON.stringify(payload))
    )
  }
}
