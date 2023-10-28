import api from '@/lib/fetch';
import { User } from '@/types/user';

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/current-user');
    return response.data?.currentUser as User;
  } catch {
    return null;
  }
};

export interface SignUpPayload {
  email: string;
  password: string;
}

export const signUp = async (values: SignUpPayload) => {
  return api.post('/api/users/sign-up', values);
};

export interface SignInPayload extends SignUpPayload {}

export const signIn = async (values: SignInPayload) => {
  return api.post('/api/users/sign-in', values);
};

export const signOut = async () => {
  return api.post('/api/users/sign-out');
};
