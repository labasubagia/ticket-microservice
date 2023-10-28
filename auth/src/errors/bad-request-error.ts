import { CustomError, type ItemError } from './custom-error'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(public message: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): ItemError[] {
    return [{ message: this.message }]
  }
}
