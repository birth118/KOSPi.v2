import express, { Request, Response } from 'express'

const route = express.Router()

route.get('/api/user/signout', (req: Request, res: Response) => {
  req.session = null // For 'local' provier
  req.logout() // For passport 'google' provider

  res.send({})
})

export { route as signOutRoute }
