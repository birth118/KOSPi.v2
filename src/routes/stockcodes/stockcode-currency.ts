import express, { Request, Response } from 'express'
import { authRequired } from '../../middleware'
import { currencyTable } from '../../apis/fx'

const route = express.Router()

route.get(
  '/api/stockcodecurrency',
  authRequired,
  async (req: Request, res: Response) => {
    const currencies = await currencyTable()
    //  console.log(currencies)

    res.send(currencies)
  }
)

export { route as stockCodeCurrency }
