import { CustomError, type ItemError } from './custom-error'

export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not Authorized')
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors(): ItemError[] {
    return [{ message: 'Not Authorized' }]
  }
}
