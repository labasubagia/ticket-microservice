import { type TicketUpdatedEvent } from '@klstickets/common'
import { mongo } from 'mongoose'

import { TicketUpdatedConsumer } from '@/events/consumers/ticket-updated-consumer'
import { Ticket } from '@/models/ticket'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new TicketUpdatedConsumer()

  const data: TicketUpdatedEvent['data'] = {
    id: new mongo.ObjectId().toString(),
    title: 'concert',
    price: 100,
    userId: new mongo.ObjectId().toString(),
    version: 0
  }

  return { consumer, data }
}

it('throw an error when current data not found', async () => {
  const { consumer, data } = await setup()
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('throw an error when version invalid', async () => {
  const { consumer, data } = await setup()

  const ticket = Ticket.build(data)
  await ticket.save()

  data.version = ticket.version + 2
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('updates the ticket', async () => {
  const { consumer, data } = await setup()

  const current = Ticket.build(data)
  await current.save()

  data.version = current.version + 1
  await consumer.onMessage(data)

  const ticket = await Ticket.findById(data.id)
  expect(ticket?.id).toEqual(data.id)
  expect(ticket?.version).toEqual(data.version)
})
