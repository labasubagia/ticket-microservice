import { type NatsConnection, NatsError } from 'nats'

import { type Subject, type Topic } from './types'

export enum StreamError {
  NotFound = 10059,
  ExistsConfigDiff = 10058
}

class StreamMaker {
  constructor(
    private readonly client: NatsConnection,
    private readonly topic: Topic,
    private readonly subject: Subject,
    private readonly retryInMs: number = 500,
    private readonly maxAttempt: number = 10
  ) {}

  async make(): Promise<void> {
    for (let attempt = 1; attempt <= this.maxAttempt; attempt++) {
      const msg = `init ${this.topic}/${this.subject} stream attempt-${attempt}`
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
    try {
      // create
      await jsm.streams.add({ name: this.topic, subjects: [this.subject] })
    } catch (error) {
      if (error instanceof NatsError) {
        const errCode = error?.api_error?.err_code

        // update
        if (errCode === StreamError.ExistsConfigDiff) {
          const stream = await jsm.streams.get(this.topic)
          const { config } = await stream.info()
          if (config.subjects.includes(this.subject)) return

          config.subjects.push(this.subject)
          config.subjects = [...new Set(config.subjects)].sort()
          await jsm.streams.update(this.topic, config)
          return
        }
      }
      throw error
    }
  }
}

export { StreamMaker }
