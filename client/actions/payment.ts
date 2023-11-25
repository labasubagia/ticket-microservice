import api from '@/lib/fetch';

export interface PayPayload {
  token: string;
  orderId: string;
}

export const createPayment = async (payload: PayPayload) => {
  return api.post('/api/payments', payload);
};
