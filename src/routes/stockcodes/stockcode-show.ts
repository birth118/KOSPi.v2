import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { StockCode } from '../../models/stockCode'
import { userInfo } from 'os'
import { NotFoundError } from '../../errors/custom-error'

const route = express.Router()

route.get(
  '/api/stockcode/:id',
  authRequired,
  async (req: Request, res: Response) => {
    const holdings = await StockCode.find({
      userId: req.currentUser!.userId,
    })

    const stock = holdings.find((stock) => {
      return (stock._id = req.params.id)
    })

    if (!stock) {
      throw new NotFoundError('the stock not found')
    }

    res.send(stock)
  }
)

export { route as stockCodeShow }
