import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import krx from 'krx-stock-api'

import { validate, authRequired } from '../../middleware'
import { BuyOrSell } from '../../models/buyOrSell-enum'
import { Transact } from '../../models/transact'
import { StockCode } from '../../models/stockCode'
import { BadRequestError } from '../../errors/custom-error'

const route = express.Router()

route.post(
  '/api/transact/',
  [
    body('companyName').not().isEmpty(),
    body('companyCode').not().isEmpty(),
    body('price').isNumeric(),
    body('amount').isNumeric(),
    body('buyOrSell')
      .custom((value) => Object.keys(BuyOrSell).includes(value))
      .withMessage('Incorrect'),
    // body('per').isNumeric(),
    body('pbr').isNumeric(),
    // body('kospi').isNumeric(),
    // body('kosdaq').isNumeric(),
  ],
  validate,
  authRequired,
  async (req: Request, res: Response) => {
    let { buyOrSell, companyCode, amount, price, per, kospi, kosdaq } = req.body
    const userId = req.currentUser!.userId

    try {
      const stock = await krx.getStock(companyCode)
      // console.log(`${stock.name} : ${stock.price}원`)
      per = stock.per
      kospi = stock.kospi.price
      kosdaq = stock.kosdaq.price
    } catch (err) {
      //   console.log(err)
      console.log('KRX api error')
      //throw new BadRequestError('KRX api error')
    }

    let profit = 0
    let profitPercent = 0

    if (buyOrSell === BuyOrSell.SELL) {
      const holdingStocks = req.currentUser!.holdingStocks
      // console.log(req.currentUser!)

      const stock = await StockCode.findOne({
        userId,
        companyCode,
      })

      profit = amount * (price - stock!.avgBuyingPrice)
      profitPercent = price / stock!.avgBuyingPrice - 1
    }

    const tran = Transact.build({
      ...req.body,
      userId,
      profit,
      profitPercent,
      per,
      kospi,
      kosdaq,
    })

    await tran.save()

    res.status(201).send(tran)
  }
)

export { route as transactNew }
