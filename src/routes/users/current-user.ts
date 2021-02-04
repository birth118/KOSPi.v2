import express, { Request, Response } from 'express'
import { currentUser } from '../../middleware/current-user'

const route = express.Router()

route.get(
  '/api/user/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null })
  }
)

export { route as currentUserRoute }
