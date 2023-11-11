import {
  Consumer,
  Subject,
  type TicketUpdatedEvent,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Ticket } from '@/models/ticket'

class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
  queueGroupName: string = queueGroupName

  failRetryWaitMs: number = 1000

  async onMessage(data: TicketUpdatedEvent['data']): Promise<void> {
    const ticket = await Ticket.findByEvent(data)
    if (ticket == null) {
      throw new Error('Ticket not found')
    }
    const { title, price } = data
    ticket.set({ title, price })
    await ticket.save()
  }
}

export { TicketUpdatedConsumer }
