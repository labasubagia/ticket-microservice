import { CustomError, type ItemError } from '@/errors/custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Route not found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): ItemError[] {
    return [{ message: 'Not Found' }]
  }
}
