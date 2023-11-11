import { type TicketCreatedEvent } from '@klstickets/common'
import { mongo } from 'mongoose'

import { TicketCreatedConsumer } from '@/events/consumers/ticket-created-consumer'
import { Ticket } from '@/models/ticket'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new TicketCreatedConsumer()

  const data: TicketCreatedEvent['data'] = {
    id: new mongo.ObjectId().toString(),
    title: 'concert',
    price: 100,
    userId: new mongo.ObjectId().toString(),
    version: 0
  }

  return { consumer, data }
}

it('creates and saves a ticket', async () => {
  const { consumer, data } = await setup()
  await consumer.onMessage(data)
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket?.title).toEqual(data.title)
  expect(ticket?.price).toEqual(data.price)
})
