import { randomBytes } from 'crypto'

export const getRandomString = (n: number = 5): string => {
  return randomBytes(n).toString('hex')
}

export interface Event {
  topic: Topic
  subject: Subject
  data: object
}

export enum Topic {
  Ticket = 'ticket'
}

export enum Subject {
  TicketCreated = 'ticket.created',
  TicketUpdated = 'ticket.updated',
  OrderUpdated = 'order.updated'
}

export const randomQueueName = getRandomString(5)
export const randomStreamName = getRandomString(5)
