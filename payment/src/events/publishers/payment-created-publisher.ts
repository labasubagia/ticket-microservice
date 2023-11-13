import {
  type PaymentCreatedEvent,
  Publisher,
  Subject,
  Topic
} from '@klstickets/common'

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  topic: Topic = Topic.Ticket
  subject: Subject.PaymentCreated = Subject.PaymentCreated
}

export const paymentCreatedPublisher = new PaymentCreatedPublisher()
