import { Request, Response, NextFunction } from 'express'
import { NotAuthorized } from '../errors/custom-error'

export const authRequired = (
  // currentUser: UserPayload,  // ** Not to include a middleware in the middleware
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorized('Not Ahthenticated')
  }

  next()
}
