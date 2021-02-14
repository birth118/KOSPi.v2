import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import krx from 'krx-stock-api'
import { authRequired, validate } from '../middleware'

import { Market } from '../models/market-enum'

const route = express.Router()

route.get('/test', async (req: Request, res: Response) => {
  const stock = await krx.getStock('069510')
  console.log(`${stock.name} : ${stock.price}원`)

  res.send({})
})

export { route as test }

// import { Market } from '../models/market-enum'

// console.log(Object.keys(Market).includes('KOSXPI'))
