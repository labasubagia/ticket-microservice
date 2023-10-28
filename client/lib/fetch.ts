import axios from 'axios';
import { getCookie as getClientCookie } from './cookie';

const baseURL = process.env.API_URL;
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Host: 'ticketing.dev',
  },
});

api.interceptors.request.use(async (config) => {
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
