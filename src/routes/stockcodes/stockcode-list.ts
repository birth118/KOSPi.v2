import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired } from '../../middleware'
import { StockCode } from '../../models/stockCode'
import { currencyTable } from '../../apis/fx'
import krx from 'krx-stock-api'
import { BadRequestError } from '../../errors/custom-error'

const route = express.Router()

route.get(
  '/api/stockcode/',
  authRequired,
  async (req: Request, res: Response) => {
    const currenciesTable = await currencyTable()

    const list = await StockCode.find({
      //@ts-ignore
      userId: req.currentUser!.userId,
    })

    // Caching the holdingStocks into req.currrentUser

    // req.currentUser!.holdingStocks = list.map((item) => {
    //   const companyCode = item.companyCode
    //   const holdings = item.holdings
    //   const avgBuyingPrice = item.avgBuyingPrice

    //   return { companyCode, holdings, avgBuyingPrice }
    // })

    // Portfolio total value
    const initialValue = 0
    const totalValue = list.reduce((accum, item) => {
      return (
        accum +
        item.currentPrice * currenciesTable[item.currency] * item.holdings
        // accum +
        // (item.currency
        //   ? item.currentPrice * currenciesTable[item.currency]
        //   : item.currentPrice) *
        //   item.holdings
      )
    }, initialValue)

    // Portfolio listing for viewing on client side
    const tempList = list.map((item) => {
      // krx
      //   .getStock(req.params.id)
      //   .then((stock) => {
      //     item.currentPrice = stock.price
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     throw new BadRequestError('KRX api error')
      //   })
      // console.log(`${stock.name} : ${stock.price}원`)

      const itemValue =
        item.holdings * item.avgBuyingPrice * currenciesTable[item.currency]

      const itemPortion =
        (item.avgBuyingPrice * currenciesTable[item.currency] * item.holdings) /
        // ((item.currency
        //   ? item.avgBuyingPrice * currenciesTable[item.currency]
        //   : item.avgBuyingPrice) *
        //   item.holdings) /
        totalValue

      return { itemValue: itemValue, itemPortion: itemPortion, item }
    })

    const sortedList = tempList.sort((a, b) => {
      return b.itemValue - a.itemValue
    })

    res.send(sortedList)
  }
)

export { route as stockCodeList }
