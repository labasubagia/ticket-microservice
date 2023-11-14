/* eslint-disable @typescript-eslint/promise-function-async */
import { connect } from 'nats'

import { TicketCreatedConsumer } from './jetstream/ticket-created-event'
import { TicketUpdatedConsumer } from './jetstream/ticket-updated-event'
import { getRandomString } from './jetstream/types'

const URL = 'http://0.0.0.0:4222'

const run = async (): Promise<void> => {
  console.clear()
  console.log('waiting for messages..', getRandomString(5))

  const client = await connect({ servers: URL })
  const jsm = await client.jetstreamManager()

  // remove all prev streams
  const prevStreams = await jsm.streams.list().next()
  for (const stream of prevStreams) {
    await jsm.streams.delete(stream.config.name)
  }

  const consumers = [new TicketCreatedConsumer(), new TicketUpdatedConsumer()]
  consumers.map(async (c) => {
    await c.init(client)
    await c.consume()
  })

  // await client.drain()
}

void run()
