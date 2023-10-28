import { RequestValidationError } from '@/errors/request-validation-error'
import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }
  next()
}
