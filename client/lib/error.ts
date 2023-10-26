import { AxiosError } from "axios"
import { ResponseError, ResponseErrorItem} from "@/types/error"

export function handleErrors(error: unknown): ResponseErrorItem[] {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ResponseError
    return data?.errors ?? []
  }
  const data: ResponseError = {
    errors: [{ message: (error as Error)?.message ?? 'unknown error' }]
  }
  return data?.errors
}