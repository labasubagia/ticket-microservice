import {
  Consumer,
  OrderStatus,
  type PaymentCreatedEvent,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Order } from '@/models/order'

class PaymentCreatedConsumer extends Consumer<PaymentCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.PaymentCreated = Subject.PaymentCreated
  queueGroupName: string = queueGroupName
  failRetryWaitMs: number = 100
  async onMessage(data: PaymentCreatedEvent['data']): Promise<void> {
    const order = await Order.findById(data.orderId)
    if (order == null) {
      throw new Error('Order not found')
    }
    order.set({ status: OrderStatus.Complete })
    await order.save()
  }
}

export { PaymentCreatedConsumer }
