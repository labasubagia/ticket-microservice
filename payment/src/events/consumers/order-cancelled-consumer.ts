import {
  Consumer,
  type OrderCancelledEvent,
  OrderStatus,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Order } from '@/models/order'

class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.OrderCancelled = Subject.OrderCancelled
  queueGroupName: string = queueGroupName
  failRetryWaitMs: number = 100

  async onMessage(data: OrderCancelledEvent['data']): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    })
    if (order == null) {
      throw new Error('Order not found')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()
  }
}
export { OrderCancelledConsumer }
