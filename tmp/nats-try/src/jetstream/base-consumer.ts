import { type JsMsg, type NatsConnection } from 'nats'

import { ConsumerMaker } from './consumer-maker'
import { StreamMaker } from './stream-maker'
import { type Event } from './types'

export abstract class Consumer<T extends Event> {
  abstract topic: T['topic']
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract failRetryWaitMs: number
  protected initRetryMs: number = 100

  abstract onMessage(data: T['data'], message: JsMsg): Promise<void>

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

    const consumerMaker = new ConsumerMaker(
      client,
      this.topic,
      this.subject,
      this.queueGroupName
    )
    await consumerMaker.make()

    return this
  }

  async consume(): Promise<void> {
    const js = this.client.jetstream()
    const consumer = await js.consumers.get(this.topic, this.queueGroupName)
    await consumer.consume({
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      callback: async (msg) => {
        if (msg.subject !== this.subject) {
          msg.nak()
          return
        }
        console.log(
          `event received: ${this.topic}/${this.subject} -> ${this.queueGroupName}`
        )
        const decoded = msg.json()
        try {
          await this.onMessage(decoded as T['data'], msg)
          msg.ack()
        } catch (error) {
          console.error(
            `Error consume msg ${msg.seq} with error: ${
              (error as Error).message
            } and payload ${JSON.stringify(decoded)}, retry in ${
              this.failRetryWaitMs
            }`
          )
          msg.nak(this.failRetryWaitMs)
        }
      }
    })
  }
}
