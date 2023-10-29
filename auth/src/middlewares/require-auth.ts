import { type NextFunction, type Request, type Response } from 'express'

import { NotAuthorizedError } from '@/errors/not-authorized-error'

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
