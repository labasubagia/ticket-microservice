import {
  Consumer,
  type OrderCreatedEvent,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import {
  expirationQueue,
  QUEUE_ORDER_EXPIRATION
} from '@/queues/expiration-queue'

class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.OrderCreated = Subject.OrderCreated
  queueGroupName: string = queueGroupName
  failRetryWaitMs: number = 1
  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log(`waiting to expire order with id ${data.id} within ${delay}ms`)
    await expirationQueue.add(
      QUEUE_ORDER_EXPIRATION,
      { orderId: data.id },
      { delay }
    )
  }
}

export { OrderCreatedConsumer }
