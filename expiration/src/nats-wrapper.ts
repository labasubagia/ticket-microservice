import { connect, type ConnectionOptions, type NatsConnection } from 'nats'

class NatsWrapper {
  private _client?: NatsConnection

  get client(): NatsConnection {
    if (this._client == null) {
      throw new Error('Cannot access NATS client before connecting')
    }
    return this._client
  }

  async connect(servers: ConnectionOptions['servers']): Promise<void> {
    this._client = await connect({ servers })
  }
}

export const natsWrapper = new NatsWrapper()
