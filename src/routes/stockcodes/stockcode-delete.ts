import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { StockCode } from '../../models/stockCode'
import { BadRequestError } from '../../errors/custom-error'

const route = express.Router()

route.delete(
  '/api/stockcode/:id',
  authRequired,
  async (req: Request, res: Response) => {
    const stock = await StockCode.deleteMany({
      userId: req.currentUser!.userId,
      companyCode: req.params.id,
      holdings: 0,
    })

    if (!stock) {
      throw new BadRequestError('Stockcode delete error')
    }

    res.send(stock)
  }
)

export { route as stockCodeDelete }
