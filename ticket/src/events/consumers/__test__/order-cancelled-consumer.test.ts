import { type OrderCancelledEvent } from '@klstickets/common'
import { mongo } from 'mongoose'

import { OrderCancelledConsumer } from '@/events/consumers/order-cancelled-consumer'
import { ticketUpdatedPublisher } from '@/events/publishers/ticket-updated-publisher'
import { Ticket } from '@/models/ticket'

const EXPIRATION_WINDOW_MINUTES = 15

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new OrderCancelledConsumer()

  const ticket = Ticket.build({
    title: 'ticket',
    price: 100,
    userId: new mongo.ObjectId().toString()
  })
  ticket.set({ orderId: new mongo.ObjectId() })
  await ticket.save()

  const expiration = new Date()
  expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_MINUTES)

  const data: OrderCancelledEvent['data'] = {
    id: new mongo.ObjectId().toString(),
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  return { consumer, data, ticket }
}

it('returns error when ticket not found', async () => {
  const { consumer, data } = await setup()
  data.ticket.id = new mongo.ObjectId().toString()
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('succeed unlock ticket', async () => {
  const { consumer, data, ticket } = await setup()
  await consumer.onMessage(data)

  const locked = await Ticket.findById(data.ticket.id)
  expect(locked?.orderId).toBeUndefined()
  expect(locked?.version).toEqual(ticket.version + 1)
})

it('published ticket updated event', async () => {
  const { consumer, data, ticket } = await setup()
  const fnMock = ticketUpdatedPublisher.publish as jest.Mock

  await consumer.onMessage(data)
  expect(fnMock).toHaveBeenCalled()

  const eventData = fnMock.mock.calls?.[0]?.[0]
  expect(eventData?.id).toEqual(ticket.id)
})
