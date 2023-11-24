import { Ticket } from '@/types/ticket';

export interface Order {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: Ticket;
  version: number;
  id: string;
}
