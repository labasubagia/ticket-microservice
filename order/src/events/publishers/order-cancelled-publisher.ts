import type { OrderCancelledEvent } from '@klstickets/common'
import { Publisher, Subject, Topic } from '@klstickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.OrderCancelled = Subject.OrderCancelled
}
