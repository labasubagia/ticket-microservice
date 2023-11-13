import { type OrderCancelledEvent, OrderStatus } from '@klstickets/common'
import { mongo } from 'mongoose'

import { OrderCancelledConsumer } from '@/events/consumers/order-cancelled-consumer'
import { Order } from '@/models/order'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new OrderCancelledConsumer()

  const order = Order.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    status: OrderStatus.Created,
    userId: new mongo.ObjectId().toString(),
    version: 0
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: new mongo.ObjectId().toString()
    }
  }

  return { consumer, data, order }
}

it('throws error when order not found', async () => {
  const { consumer, data } = await setup()
  data.id = new mongo.ObjectId().toString()
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('should be able to cancel order', async () => {
  const { consumer, data } = await setup()
  await consumer.onMessage(data)

  const updated = await Order.findById(data.id)
  expect(updated?.status).toEqual(OrderStatus.Cancelled)
})
