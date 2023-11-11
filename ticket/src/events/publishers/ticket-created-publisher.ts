import {
  Publisher,
  Subject,
  TicketCreatedEvent,
  Topic
} from '@klstickets/common'

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketCreated = Subject.TicketCreated
}

export const ticketCreatedPublisher = new TicketCreatedPublisher()
