import express, { Request, Response } from 'express'
import { authRequired } from '../../middleware'
import { StockCode } from '../../models/stockCode'
import { currencyTable } from '../../apis/fx'

const route = express.Router()

route.get(
  '/api/stockcodesummary',
  authRequired,
  async (req: Request, res: Response) => {
    const currenciesTable = await currencyTable()

    const stockCodes = await StockCode.find({
      userId: req.currentUser!.userId,
    }).sort({
      holdings: -1,
    })
    const initialValue = 0
    const totalValue = stockCodes.reduce((accum, item) => {
      return (
        accum +
        (item.currency
          ? item.currentPrice * currenciesTable[item.currency]
          : item.currentPrice) *
          item.holdings
      )
    }, initialValue)

    const buyingValue = stockCodes.reduce((accum, item) => {
      return (
        accum +
        (item.currency
          ? item.avgBuyingPrice * currenciesTable[item.currency]
          : item.avgBuyingPrice) *
          item.holdings
      )
    }, initialValue)

    const numberOfholdingStocks = stockCodes.reduce((accum, item) => {
      return accum + (item.holdings === 0 ? 0 : 1)
    }, initialValue)

    const portFolio = {
      totalBuying: buyingValue,
      totalValue: totalValue,
      numberOfStocks: numberOfholdingStocks,
    }

    const summary = {
      currenciesTable,
      portFolio,
    }

    res.send(summary)
  }
)

export { route as stockCodeSummary }
