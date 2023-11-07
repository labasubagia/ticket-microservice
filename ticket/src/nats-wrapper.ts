import { NatsConnection, connect } from 'nats'

class NatsWrapper {
  private _client?: NatsConnection

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }
    return this._client
  }

  async connect(servers: string) {
    this._client = await connect({ servers: servers })
  }
}

export const natsWrapper = new NatsWrapper()
