import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { StockCode } from '../../models/stockCode'

const route = express.Router()

route.delete(
  '/api/stockcode/:id',
  authRequired,
  async (req: Request, res: Response) => {
    const stock = await StockCode.deleteOne({
      userId: req.currentUser?.userId,
      _id: req.params.id,
    })

    res.send(stock)
  }
)

export { route as stockCodeDelete }
