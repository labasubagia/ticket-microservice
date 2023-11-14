import {
  AckPolicy,
  type ConsumerInfo,
  DeliverPolicy,
  type NatsConnection,
  NatsError
} from 'nats'

import { type Subject, type Topic } from './types'

const CodeConsumerNotFound = 10014

class ConsumerMaker {
  constructor(
    private readonly client: NatsConnection,
    private readonly topic: Topic,
    private readonly subject: Subject,
    private readonly queueGroupName: string,
    private readonly retryMs: number = 100
  ) {}

  async make(): Promise<ConsumerInfo> {
    const jsm = await this.client.jetstreamManager()
    const js = this.client.jetstream()

    try {
      // update consumer when already exists
      const consumer = await js.consumers.get(this.topic, this.queueGroupName)
      const info = await consumer.info()

      let filterSubjects = [
        ...(info.config.filter_subjects ?? []),
        this.subject as string
      ]
      filterSubjects = [...new Set(filterSubjects)].sort()
      info.config.filter_subjects = filterSubjects
      info.config.filter_subject = undefined

      return await jsm.consumers.update(
        this.topic,
        this.queueGroupName,
        info.config
      )
    } catch (error) {
      if (error instanceof NatsError) {
        const errCode = error?.api_error?.err_code
        if (errCode === CodeConsumerNotFound) {
          // create consumer
          // if failed retry in retryMs
          return await jsm.consumers
            .add(this.topic, {
              durable_name: this.queueGroupName,
              deliver_policy: DeliverPolicy.All,
              ack_policy: AckPolicy.Explicit,
              filter_subjects: [this.subject]
            })
            .catch(async () => {
              await new Promise((resolve) => setTimeout(resolve, this.retryMs))
              return await this.make()
            })
        }
      }
      throw error
    }
  }
}

export { ConsumerMaker }
