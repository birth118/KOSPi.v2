import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { Market } from '../../models/market-enum'
import { Currency } from '../../models/currency-enum'
import { StockCode } from '../../models/stockCode'
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from '../../errors/custom-error'
import { User } from '../../models/user'

const route = express.Router()

route.post(
  '/api/stockcode/',
  [
    // body('userId').not().isEmpty(),
    body('companyName').not().isEmpty(),
    body('companyCode').not().isEmpty(),
    body('market')
      .custom((value) => Object.keys(Market).includes(value))
      .withMessage('Incorrect'),
    body('currency')
      .custom((value) => Object.keys(Currency).includes(value))
      .withMessage('Incorrect'),
    body('wics').not().isEmpty(),
  ],
  validate,
  authRequired,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.userId
    const companyCode = req.body.companyCode
    const existed = await StockCode.findOne({
      userId,
      companyCode,
    })
    if (existed) {
      throw new ConflictError('already existed')
    }

    const stockCode = StockCode.build({ ...req.body, userId })
    await stockCode.save()
    res.status(201).send(stockCode)

    // console.log(req.body)
  }
)

export { route as stockCodeNew }
