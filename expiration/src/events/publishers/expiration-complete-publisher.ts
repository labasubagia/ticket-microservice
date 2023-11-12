import {
  type ExpirationCompleteEvent,
  Publisher,
  Subject,
  Topic
} from '@klstickets/common'

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  topic: Topic.Ticket = Topic.Ticket
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete
}

const expirationCompletePublisher = new ExpirationCompletePublisher()

export { expirationCompletePublisher }
