import api from '@/lib/fetch';
import { number, string } from 'zod';

export const list = async () => {
  return api.get('/api/tickets');
};

export const detail = async (id: string) => {
  return api.get(`/api/tickets/${id}`);
};

interface Payload {
  title: string;
  prince: number;
}

export const create = async (payload: Payload) => {
  return api.post(`/api/tickets`, payload);
};

export const update = async (id: string, payload: Payload) => {
  return api.put(`/api/tickets/${id}`, payload);
};
