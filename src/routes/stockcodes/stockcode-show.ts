import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../../middleware'
import { StockCode } from '../../models/stockCode'
import krx from 'krx-stock-api'
import { NotFoundError, BadRequestError } from '../../errors/custom-error'

const route = express.Router()

route.get(
  '/api/stockcode/:id',
  authRequired,

  async (req: Request, res: Response) => {
    const stock = await StockCode.findOne({
      userId: req.currentUser!.userId,
      companyCode: req.params.id,
    })

    if (!stock) {
      throw new NotFoundError('the stock not found')
    }

    let currentPrice = stock.currentPrice
    try {
      const jongmok = await krx.getStock(req.params.id)
      // console.log(`${stock.name} : ${stock.price}원`)
      stock!.currentPrice = jongmok.price
    } catch (err) {
      console.log(err)
      stock!.currentPrice = 0
      //  console.log('KRX api error')
      //throw new BadRequestError('KRX api error')
    }

    // console.log(stock)

    res.send(stock)
  }
)

export { route as stockCodeShow }
