import { CustomError, type ItemError } from '@/errors/custom-error'
import {
  type FieldValidationError,
  type ValidationError
} from 'express-validator'

export class RequestValidationError extends CustomError {
  statusCode = 400

  constructor(private readonly errors: ValidationError[]) {
    super('Invalid request parameters')
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors(): ItemError[] {
    return this.errors.map((error) => {
      return {
        message: error.msg,
        field: (error as FieldValidationError)?.path
      }
    })
  }
}
