export interface Event {
  topic: Topic;
  subject: Subject;
  data: object;
}

export enum Topic {
  Ticket = "ticket",
}

export enum Subject {
  TicketCreated = "ticket.created",
  TicketUpdated = "ticket.updated",
  OrderUpdated = "order.updated",
}
