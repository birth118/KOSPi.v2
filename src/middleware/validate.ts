import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/custom-error'

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // console.log(errors)
    // return res.status(400).send({ errors: errors.array() })
    throw new RequestValidationError(errors.array())
  }
  next()
}
