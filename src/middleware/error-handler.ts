import { Request, Response, NextFunction } from 'express'
import { CustomErrorInterface } from '../errors/custom-error'

export const errorHanlder = (
  error: CustomErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.hasOwnProperty('IsCustomErrorInterface')) {
    return res.status(error.statusCode).send({ errors: error.serialiseError() })
  }
  console.log(error)

  res.status(500).send({ errors: [{ message: 'Unknown Error' }] })
}
