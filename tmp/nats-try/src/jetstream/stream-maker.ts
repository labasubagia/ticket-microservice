import { type NatsConnection, NatsError, type StreamInfo } from 'nats'

import { type Subject, type Topic } from './types'

const CodeStreamNotFound = 10059

class StreamMaker {
  constructor(
    private readonly client: NatsConnection,
    private readonly topic: Topic,
    private readonly subject: Subject,
    private readonly retryMs: number = 500,
    private maxRetry: number = 5
  ) {}

  async make(): Promise<StreamInfo> {
    if (this.maxRetry <= 0) {
      throw new Error('Maximum stream init retry exceeded')
    }
    this.maxRetry -= 1

    const jsm = await this.client.jetstreamManager()

    try {
      // update stream when already exists
      const stream = await jsm.streams.get(this.topic)
      const info = await stream.info()

      let subjects = [...info.config.subjects, this.subject as string]
      subjects = [...new Set(subjects)].sort()
      info.config.subjects = subjects

      return await jsm.streams.update(this.topic, info.config)
    } catch (error) {
      if (error instanceof NatsError) {
        const errCode = error?.api_error?.err_code
        if (errCode === CodeStreamNotFound) {
          // create new stream
          // if error, retry in retryMs duration
          return await jsm.streams
            .add({ name: this.topic, subjects: [this.subject] })
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

export { StreamMaker }
