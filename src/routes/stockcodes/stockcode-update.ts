import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { NotFoundError } from '../../errors/custom-error'
import { StockCode } from '../../models/stockCode'

const route = express.Router()

route.patch(
  '/api/stockcode/:id',
  [
    body('evEbitda').isNumeric(),
    body('currentPrice').isNumeric(),
    body('intrinsic').isNumeric(),
  ],
  validate,
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
    const { evEbitda, currentPrice, intrinsic, comment } = req.body

    stock.set({ ...stock, evEbitda, currentPrice, intrinsic, comment })

    await stock.save()
    res.send(stock)
  }
)

export { route as stockCodeUpdate }
