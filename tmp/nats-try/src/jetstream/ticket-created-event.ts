import { Consumer } from "./base-consumer";
import { Publisher } from "./base-publisher";
import { Subject, Topic } from "./types";

export interface TicketCreatedEvent {
  topic: Topic.Ticket;
  subject: Subject.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketCreated = Subject.TicketCreated;
}

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName: string = "payment-service";
  failRetryWaitMs: number = 500;

  async onMessage(data: TicketCreatedEvent["data"]): Promise<void> {
    console.log(`received created`, data);
  }
}
