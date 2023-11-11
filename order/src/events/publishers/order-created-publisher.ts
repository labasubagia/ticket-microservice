import type { OrderCreatedEvent } from '@klstickets/common'
import { Publisher, Subject, Topic } from '@klstickets/common'

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.OrderCreated = Subject.OrderCreated
}

const orderCreatedPublisher = new OrderCreatedPublisher()

export { orderCreatedPublisher }
