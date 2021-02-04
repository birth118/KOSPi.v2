import { ValidationError } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

interface CustomErrorInterface {
  statusCode: number
  serialiseError(): { message: string; field?: string }[]
  IsCustomErrorInterface: boolean
}

const error = {}

class NotFoundError extends Error implements CustomErrorInterface {
  statusCode = 404
  IsCustomErrorInterface = true
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serialiseError = () => {
    return [{ message: this.message }]
  }
}

class BadRequestError extends Error implements CustomErrorInterface {
  statusCode = 400
  IsCustomErrorInterface = true
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serialiseError = () => {
    return [{ message: this.message }]
  }
}

class NotAuthorized extends Error implements CustomErrorInterface {
  statusCode = 403
  IsCustomErrorInterface = true
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, NotAuthorized.prototype)
  }

  serialiseError = () => {
    return [{ message: this.message }]
  }
}

class ConflictError extends Error implements CustomErrorInterface {
  statusCode = 409
  IsCustomErrorInterface = true
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }

  serialiseError = () => {
    return [{ message: this.message }]
  }
}

class RequestValidationError extends Error implements CustomErrorInterface {
  statusCode = 400
  errors: ValidationError[]
  IsCustomErrorInterface = true

  constructor(err: ValidationError[]) {
    super('invalid request')
    this.errors = err
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serialiseError = () => {
    return this.errors.map((item: ValidationError) => {
      return { message: item.msg, field: item.param }
    })
  }
}

export {
  CustomErrorInterface,
  NotFoundError,
  RequestValidationError,
  BadRequestError,
  NotAuthorized,
  ConflictError,
}

//  const errorHanlder = (
//   error: CustomErrorInterface,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (error.hasOwnProperty('IsCustomErrorInterface')) {
//     return res.status(error.statusCode).send({ errors: error.serialiseError() })
//   }

//   res.status(500).send({ errors: [{ message: 'Unknown Error' }] })
// }

/* 

  [
    { message: 'Not found #1', filed: 'name' },
    { message: 'Not Found #2' },
  ],
 */
