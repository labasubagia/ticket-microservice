import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

export interface UserPayload {
  id: string
  email: string
}

export const currentUser = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  if (req.session?.jwt == null) {
    next()
    return
  }
  try {
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY ?? ''
    ) as UserPayload
    req.currentUser = payload
  } catch (error) {
  } finally {
    next()
  }
}
