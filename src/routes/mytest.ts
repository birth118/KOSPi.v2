import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { authRequired, validate } from '../middleware'

import { Market } from '../models/market-enum'

const route = express.Router()

route.post(
  '/test',
  [body('ebitda').isNumeric()],
  validate,

  async (req: Request, res: Response) => {
    res.send({})
  }
)

export { route as test }

// import { Market } from '../models/market-enum'

// console.log(Object.keys(Market).includes('KOSXPI'))
