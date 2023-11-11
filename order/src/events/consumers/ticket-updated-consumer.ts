import type { TicketUpdatedEvent } from '@klstickets/common'
import { Consumer, Subject, Topic } from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Ticket } from '@/models/ticket'

class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketUpdated = Subject.TicketUpdated
  queueGroupName: string = queueGroupName

  failRetryWaitMs: number = 1000

  async onMessage(data: TicketUpdatedEvent['data']): Promise<void> {
    const { id, title, price } = data
    const ticket = await Ticket.findById(id)
    if (ticket == null) {
      throw new Error('Ticket not found')
    }
    ticket.set({ title, price })
    await ticket.save()
  }
}

export { TicketUpdatedConsumer }
