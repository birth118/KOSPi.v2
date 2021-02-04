import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { validate, authRequired } from '../../middleware'
import { BuyOrSell } from '../../models/buyOrSell-enum'
import { Transact } from '../../models/transact'

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
    body('per').isNumeric(),
    body('pbr').isNumeric(),
    body('kospi').isNumeric(),
    body('kosdaq').isNumeric(),
  ],
  validate,
  authRequired,
  async (req: Request, res: Response) => {
    const { buyOrSell, companyCode, amount, price } = req.body
    const userId = req.currentUser!.userId

    let profit = 0
    let profitPercent = 0
    if (buyOrSell === BuyOrSell.SELL) {
      const holdingStocks = req.currentUser!.holdingStocks
      // console.log(req.currentUser!)

      const theHolding = holdingStocks.find(
        (item) => item.companyCode === companyCode
      )
      profit = amount * (price - theHolding!.avgBuyingPrice)
      profitPercent = price / theHolding!.avgBuyingPrice - 1
    }

    const tran = Transact.build({ ...req.body, userId, profit, profitPercent })
    await tran.save()

    res.status(201).send(tran)
  }
)

export { route as transactNew }
