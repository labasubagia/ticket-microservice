import { Consumer } from './base-consumer'
import { Publisher } from './base-publisher'
import { Subject, Topic } from './types'

export interface TicketUpdatedEvent {
  topic: Topic.Ticket
  subject: Subject.TicketUpdated
  data: {
    id: string
    title: string
    price: number
    userId: string
  }
}
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
}

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
  queueGroupName: string = 'payment-service'
  failRetryWaitMs: number = 500

  async onMessage(data: TicketUpdatedEvent['data']): Promise<void> {
    console.log(data)
  }
}
