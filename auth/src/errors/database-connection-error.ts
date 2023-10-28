import { CustomError, type ItemError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'

  constructor() {
    super('Error connecting to database')
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors(): ItemError[] {
    return [{ message: this.reason }]
  }
}
