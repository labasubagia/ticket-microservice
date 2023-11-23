import { User } from '@/types/user';

export interface Ticket {
  id: string;
  version: number;
  userId: User['id'];
  title: string;
  price: number;
}
