import { type OrderCreatedEvent, OrderStatus } from '@klstickets/common'
import { mongo } from 'mongoose'

import { OrderCreatedConsumer } from '@/events/consumers/order-created-consumer'
import { Order } from '@/models/order'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new OrderCreatedConsumer()

  const data: OrderCreatedEvent['data'] = {
    id: new mongo.ObjectId().toString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    userId: new mongo.ObjectId().toString(),
    version: 0,
    ticket: {
      id: new mongo.ObjectId().toString(),
      price: 10
    }
  }

  return { consumer, data }
}

it('should be able to replicate order', async () => {
  const { consumer, data } = await setup()
  await consumer.onMessage(data)

  const order = await Order.findById(data.id)
  expect(order?.price).toEqual(data.ticket.price)
})
