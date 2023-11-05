import { JsMsg } from "nats";
import { Consumer, Publisher } from "./base";
import { Subject, Topic } from "./enum";

interface Payload {
  id: string;
  title: string;
  price: number;
}

export interface TicketCreatedEvent {
  topic: Topic.Ticket;
  subject: Subject.TicketCreated;
  data: Payload;
}

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketCreated = Subject.TicketCreated;
}

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName: string = "payment-service-ticket-created";
  failRetryWaitMs: number = 500;

  async onMessage(m: JsMsg, data: TicketCreatedEvent["data"]): Promise<void> {
    console.log(`[${m.seq}] received created`, data);
  }
}

export interface TicketUpdatedEvent {
  topic: Topic.Ticket;
  subject: Subject.TicketUpdated;
  data: Payload;
}
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  topic: Topic.Ticket = Topic.Ticket;
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName: string = "payment-service-ticket-updated";
  failRetryWaitMs: number = 500;

  async onMessage(m: JsMsg, data: TicketUpdatedEvent["data"]): Promise<void> {
    console.log(`[${m.seq}] received updated`, data);
  }
}
