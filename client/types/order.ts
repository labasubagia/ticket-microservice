import { Ticket } from '@/types/ticket';

export interface Order {
  userId: string;
  status: OrderStatus;
  expiresAt: string;
  ticket: Ticket;
  version: number;
  id: string;
}

export enum OrderStatus {
  Created = 'created',
  AwaitingPayment = 'awaiting:payment',
  Cancelled = 'cancelled',
  Complete = 'complete',
}

export const getOrderExpiresDiff = (order: Order) => {
  return new Date(order.expiresAt).getTime() - new Date().getTime();
};

export const isOrderFinished = (order: Order) => {
  return [OrderStatus.Cancelled, OrderStatus.Complete].includes(order.status);
};

export const isOrderPending = (order: Order) => {
  return getOrderExpiresDiff(order) > 0 && !isOrderFinished(order);
};
