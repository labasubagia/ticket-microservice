import { User } from '@/types/user';
import { Order } from './order';

export interface Ticket {
  id: string;
  version: number;
  userId: User['id'];
  orderId?: Order['id'];
  title: string;
  price: number;
}
