import { AckPolicy, DeliverPolicy, type NatsConnection, NatsError } from 'nats'

import { type Subject, type Topic } from './types'

export enum ConsumerError {
  NotFound = 10014,
  AlreadyExists = 10148
}

class ConsumerMaker {
  constructor(
    private readonly client: NatsConnection,
    private readonly topic: Topic,
    private readonly subject: Subject,
    private readonly queueGroupName: string,
    private readonly retryInMs: number = 500,
    private readonly maxAttempt: number = 10
  ) {}

  async make(): Promise<void> {
    for (let attempt = 1; attempt <= this.maxAttempt; attempt++) {
      const msg = `init ${this.topic}/${this.subject} consumer attempt-${attempt} in queue ${this.queueGroupName}`
      try {
        await this.upsert()
        console.log(msg, 'OK')
        break
      } catch (error) {
        console.log(msg, 'failed with error:', (error as Error).message)
      } finally {
        await new Promise((resolve) => setTimeout(resolve, this.retryInMs))
      }
    }
  }

  async upsert(): Promise<void> {
    const jsm = await this.client.jetstreamManager()
    const js = this.client.jetstream()
    try {
      // create
      await jsm.consumers.add(this.topic, {
        durable_name: this.queueGroupName,
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        filter_subjects: [this.subject]
      })
    } catch (error) {
      if (error instanceof NatsError) {
        const errCode = error?.api_error?.err_code

        // update
        if (errCode === ConsumerError.AlreadyExists) {
          const consumer = await js.consumers.get(
            this.topic,
            this.queueGroupName
          )
          const { config } = await consumer.info()
          const filterSubjects = config.filter_subjects ?? []
          if (filterSubjects.includes(this.topic)) return

          filterSubjects.push(this.subject)
          config.filter_subjects = [...new Set(filterSubjects)].sort()
          config.filter_subject = undefined
          await jsm.consumers.update(this.topic, this.queueGroupName, config)
          return
        }
      }
      throw error
    }
  }
}

export { ConsumerMaker }
