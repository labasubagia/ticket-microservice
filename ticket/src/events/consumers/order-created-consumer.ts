import {
  Consumer,
  type OrderCreatedEvent,
  Subject,
  Topic
} from '@klstickets/common'

import { queueGroupName } from '@/events/consumers/queue-group-name'
import { ticketUpdatedPublisher } from '@/events/publishers/ticket-updated-publisher'
import { Ticket } from '@/models/ticket'

class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.OrderCreated = Subject.OrderCreated
  queueGroupName: string = queueGroupName
  failRetryWaitMs: number = 100

  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)
    if (ticket == null) {
      throw new Error('Ticket not found')
    }
    ticket.set({ orderId: data.id })
    await ticket.save()

    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    })
  }
}

export { OrderCreatedConsumer }
