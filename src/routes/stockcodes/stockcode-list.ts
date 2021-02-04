import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired } from '../../middleware'
import { StockCode } from '../../models/stockCode'

const route = express.Router()

route.get(
  '/api/stockcode/',
  authRequired,
  async (req: Request, res: Response) => {
    const list = await StockCode.find({
      userId: req.currentUser!.userId,
    })

    // Caching the holdingStocks into req.currrentUser
    req.currentUser!.holdingStocks = list.map((item) => {
      const companyCode = item.companyCode
      const holdings = item.holdings
      const avgBuyingPrice = item.avgBuyingPrice

      return { companyCode, holdings, avgBuyingPrice }
    })

    //Todo: Put  sort listing logic here for viewing

    const tempList = list.map((item) => {
      const total = item.holdings * item.avgBuyingPrice

      return { total: total, item }
    })

    const sortedList = tempList.sort((a, b) => {
      return b.total - a.total
    })
    // console.log(sortedList)
    res.send(sortedList)
  }
)

export { route as stockCodeList }
