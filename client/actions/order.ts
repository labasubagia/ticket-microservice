import api from '@/lib/fetch';
import { Order } from '@/types/order';

export const createOrder = async (ticketId: string) => {
  const res = await api.post(`/api/orders`, { ticketId });
  const data = res.data as Order;
  return data;
};

export const detailOrder = async (orderId: string) => {
  const res = await api.get(`/api/orders/${orderId}`);
  const data = res.data as Order;
  return data;
};

export const listOrder = async () => {
  const res = await api.get('/api/orders');
  const data = res.data as Order[];
  return data;
};
