import api from '@/lib/fetch';
import { Ticket } from '@/types/ticket';

export const list = async () => {
  const res = await api.get('/api/tickets');
  const data = ((await res.data) ?? []) as Ticket[];
  return data;
};

export const detail = async (id: string) => {
  const res = api.get(`/api/tickets/${id}`);
  const data = (await res).data as Ticket | null;
  return data;
};

export interface TicketPayload {
  title: string;
  price: number;
}

export const create = async (payload: TicketPayload) => {
  return api.post(`/api/tickets`, payload);
};

export const update = async (id: string, payload: TicketPayload) => {
  return api.put(`/api/tickets/${id}`, payload);
};
