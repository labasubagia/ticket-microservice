import {
  Consumer,
  type ExpirationCompleteEvent,
  OrderStatus,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Order } from '@/models/order'

import { orderCancelledPublisher } from '../publishers/order-cancelled-publisher'

class ExpirationCompleteConsumer extends Consumer<ExpirationCompleteEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete
  queueGroupName: string = queueGroupName

  failRetryWaitMs: number = 100

  async onMessage(data: ExpirationCompleteEvent['data']): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (order == null) {
      throw new Error('Order not found')
    }

    if (order.status === OrderStatus.Complete) {
      return
    }

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    await orderCancelledPublisher.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })
  }
}

export { ExpirationCompleteConsumer }
