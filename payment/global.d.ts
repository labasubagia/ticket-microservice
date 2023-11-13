import { type Request as ExpressRequest } from 'express'

interface UserPayload {
  id?: string
  email?: string
}

declare module 'express' {
  interface Request extends ExpressRequest {
    currentUser?: UserPayload
  }
}
