import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

import { StockCode } from '../models/stockCode'
const secret = process.env.JWT_SECRET || 'SECRET'

export interface UserPayload {
  email: string
  userId: string
  holdingStocks: {
    companyCode: string
    holdings: number
    avgBuyingPrice: number
  }[]
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log('--->CURRENT USER')

  // console.log(req.session)

  // -> req.isAuthenticated() is only avaiable for Passport.
  // JWT session doesn't provide this
  // console.log(req.isAuthenticated())

  if (!req.session || !req.session.jwt) {
    return next()
  }

  try {
    var payload = jwt.verify(req.session.jwt, secret) as UserPayload

    //  console.log(payload) // bar
    req.currentUser = payload
  } catch (err) {}

  next()
}
