import type { TicketCreatedEvent } from '@klstickets/common'
import { Consumer, Subject, Topic } from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { Ticket } from '@/models/ticket'

class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.TicketCreated = Subject.TicketCreated
  queueGroupName: string = queueGroupName

  failRetryWaitMs: number = 1000

  async onMessage(data: TicketCreatedEvent['data']): Promise<void> {
    const { id, title, price } = data
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()
  }
}

export { TicketCreatedConsumer }
