/* eslint-disable @typescript-eslint/promise-function-async */
import { connect } from 'nats'

import { TicketCreatedConsumer } from './jetstream/ticket-created-event'
import { TicketUpdatedConsumer } from './jetstream/ticket-updated-event'
import { getRandomString } from './jetstream/types'

const URL = 'http://0.0.0.0:4222'

const run = async (): Promise<void> => {
  console.log('waiting for messages...', getRandomString(5))

  const client = await connect({ servers: URL })
  const consumers = [new TicketCreatedConsumer(), new TicketUpdatedConsumer()]

  await Promise.all(
    consumers.map(async (c) => {
      await c.init(client)
    })
  )
  await Promise.all(
    consumers.map(async (c) => {
      await c.consume()
    })
  )
}

void run()
