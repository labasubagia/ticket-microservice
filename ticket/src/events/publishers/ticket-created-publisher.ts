import {
  Publisher,
  Subject,
  TicketCreatedEvent,
  Topic
} from '@klstickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketCreated = Subject.TicketCreated
}
