import { ResponseError, ResponseErrorItem } from '@/types/error';
import { AxiosError } from 'axios';

export function handleErrors(error: unknown): ResponseErrorItem[] {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ResponseError;
    return data?.errors ?? [{ message: error.message }];
  }
  if (error instanceof Error) {
    return [{ message: error.message }];
  }
  return [{ message: 'unknown error' }];
}
