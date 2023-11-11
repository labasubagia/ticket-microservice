import {
  AckPolicy,
  DeliverPolicy,
  ErrorCode,
  type JsMsg,
  type NatsConnection,
  type NatsError
} from 'nats'

import { type Event } from './types'

export abstract class Consumer<T extends Event> {
  abstract topic: T['topic']
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract failRetryWaitMs: number

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

    const jsm = await this.client.jetstreamManager()
    const js = this.client.jetstream()

    // upsert stream
    await jsm.streams
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

    // upsert consumer
    await js.consumers
      .get(this.topic, this.queueGroupName)
      .then(async (consumer) => {
        const { config } = await consumer.info()
        const hasSubject = (config.filter_subjects ?? []).includes(this.subject)
        if (hasSubject) {
          return
        }

        config.filter_subjects?.push(this.subject)
        await jsm.consumers.update(this.topic, this.queueGroupName, {
          ...config,
          filter_subject: undefined
        })
      })
      .catch(async (error) => {
        const isNotFound =
          (error as NatsError)?.code === ErrorCode.JetStream404NoMessages
        if (isNotFound) {
          await jsm.consumers.add(this.topic, {
            durable_name: this.queueGroupName,
            deliver_policy: DeliverPolicy.All,
            ack_policy: AckPolicy.Explicit,
            filter_subjects: [this.subject]
          })
          return
        }
        console.log(error.message)
      })

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
