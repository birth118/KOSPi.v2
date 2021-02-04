import express, { Request, Response } from 'express'

import { validate, authRequired } from '../../middleware'
import { Transact } from '../../models/transact'

const route = express.Router()

route.get(
  '/api/transactAll/:fromDate',

  authRequired,
  async (req: Request, res: Response) => {
    const dateString =
      req.params.fromDate.length !== 8
        ? `${new Date().getFullYear()}0101`
        : req.params.fromDate

    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    const date = new Date(`${year}-${month}-${day}`)

    const history = await Transact.find({
      userId: req.currentUser!.userId,
      createdAt: { $gte: date },
    }).sort({ createdAt: -1 })

    res.send(history)
  }
)

export { route as transactAllByDate }
