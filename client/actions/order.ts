import api from '@/lib/fetch';
import { Order } from '@/types/order';

export const createOrder = async (ticketId: string) => {
  const res = api.post(`/api/orders`, { ticketId });
  const data = (await res).data as Order;
  return data;
};

export const detailOrder = async (orderId: string) => {
  const res = api.get(`/api/orders/${orderId}`);
  const data = (await res).data as Order;
  return data;
};
