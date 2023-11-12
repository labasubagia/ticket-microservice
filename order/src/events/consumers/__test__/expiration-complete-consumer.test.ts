import { type ExpirationCompleteEvent } from '@klstickets/common'
import { mongo } from 'mongoose'

import { ExpirationCompleteConsumer } from '@/events/consumers/expiration-complete-consumer'
import { orderCancelledPublisher } from '@/events/publishers/order-cancelled-publisher'
import { Order, OrderStatus } from '@/models/order'
import { Ticket } from '@/models/ticket'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setup = async () => {
  const consumer = new ExpirationCompleteConsumer()

  const ticket = Ticket.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    title: 'ticket'
  })
  await ticket.save()

  const order = Order.build({
    userId: new mongo.ObjectId().toString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  return { consumer, order, ticket, data }
}

it('fails when order not found', async () => {
  const { consumer, data } = await setup()
  data.orderId = new mongo.ObjectId().toString()
  await expect(async () => {
    await consumer.onMessage(data)
  }).rejects.toThrow()
})

it('does nothing to order when already completed', async () => {
  const { consumer, data, order } = await setup()

  order.set({ status: OrderStatus.Complete })
  await order.save()

  await consumer.onMessage(data)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Complete)
})

it('updates when order status cancelled', async () => {
  const { consumer, data, order } = await setup()
  await consumer.onMessage(data)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const { consumer, data, order } = await setup()
  await consumer.onMessage(data)

  const fnMock = orderCancelledPublisher.publish
  expect(fnMock).toHaveBeenCalled()

  const eventData = (fnMock as jest.Mock).mock.calls?.[0]?.[0]
  expect(eventData?.id).toEqual(order.id)
})
