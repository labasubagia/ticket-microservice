import { OrderStatus, type PaymentCreatedEvent } from '@klstickets/common'
import { mongo } from 'mongoose'

import { PaymentCreatedConsumer } from '@/events/consumers/payment-created-consumer'
import { Order } from '@/models/order'
import { Ticket } from '@/models/ticket'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new PaymentCreatedConsumer()

  const ticket = Ticket.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    title: 'ticket'
  })
  await ticket.save()

  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    userId: new mongo.ObjectId().toString(),
    ticket
  })
  await order.save()

  const data: PaymentCreatedEvent['data'] = {
    id: new mongo.ObjectId().toString(),
    orderId: order.id,
    stripeId: 'mock_stripe_id'
  }

  return { consumer, ticket, order, data }
}

it('returns 404 error when order not found', async () => {
  const { consumer, data } = await setup()
  data.orderId = new mongo.ObjectId().toString()
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('updates ticket status to complete', async () => {
  const { consumer, data } = await setup()
  await consumer.onMessage(data)
  const updated = await Order.findById(data.orderId)
  expect(updated?.id).toEqual(data.orderId)
  expect(updated?.status).toEqual(OrderStatus.Complete)
})
