import {
  Consumer,
  type OrderCreatedEvent,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Order } from '@/models/order'

class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.OrderCreated = Subject.OrderCreated
  queueGroupName: string = queueGroupName
  failRetryWaitMs: number = 100

  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    })
    await order.save()
  }
}
export { OrderCreatedConsumer }
