import { getCookie as getClientCookie } from '@/lib/cookie';
import axios from 'axios';

const baseURL = process.env.API_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Host: 'ticketing.dev',
  },
});

api.interceptors.request.use(async (config) => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const { cookies } = await import('next/headers');
    const store = cookies();
    const session = store.get('session');
    config.headers['Cookie'] = `${session?.name}=${session?.value}`;
    return config;
  }

  config.baseURL = '/';
  config.headers['Cookie'] = `session=${getClientCookie('session')}`;
  return config;
});

export default api;
