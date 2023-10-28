import { type Request as ExpressRequest } from 'express'
import { type UserPayload } from './src/middlewares/current-user'

declare module 'express' {
  interface Request extends ExpressRequest {
    currentUser?: UserPayload
  }
}
