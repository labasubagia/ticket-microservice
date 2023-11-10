import type { OrderCreatedEvent } from '@klstickets/common'
import { Publisher, Subject, Topic } from '@klstickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.OrderCreated = Subject.OrderCreated
}
