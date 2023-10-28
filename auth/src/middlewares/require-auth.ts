import { NotAuthorizedError } from '@/errors/not-authorized-error'
import { type NextFunction, type Request, type Response } from 'express'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.currentUser == null) {
    throw new NotAuthorizedError()
  }
  next()
}
