import {
  Publisher,
  Subject,
  TicketUpdatedEvent,
  Topic
} from '@klstickets/common'

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
}

export const ticketUpdatedPublisher = new TicketUpdatedPublisher()
