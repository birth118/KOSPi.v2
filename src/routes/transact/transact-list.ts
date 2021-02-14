import express, { Request, Response } from 'express'

import { validate, authRequired } from '../../middleware'
import { Transact } from '../../models/transact'

const route = express.Router()

route.get(
  '/api/transact/:stockcode',

  authRequired,
  async (req: Request, res: Response) => {
    const list = await Transact.find({
      userId: req.currentUser!.userId,
      companyCode: req.params.stockcode,
    }).sort({ createdAt: 'desc' })
    res.send(list)
  }
)

export { route as transactList }
