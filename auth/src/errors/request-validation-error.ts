import { FieldValidationError, ValidationError } from "express-validator";

export class RequestValidationError extends Error {
    statusCode = 400

    constructor(private errors: ValidationError[]) {
        super()
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(error => {
            return { message: error.msg, field: (error as FieldValidationError)?.path }
        })
    }
}