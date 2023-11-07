import {
  Publisher,
  Subject,
  TicketUpdatedEvent,
  Topic
} from '@klstickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
}
