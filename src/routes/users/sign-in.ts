import express, { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'

import jwt from 'jsonwebtoken'

import { Password, validate } from '../../middleware'
import { NotFoundError, BadRequestError } from '../../errors/custom-error'
import { User } from '../../models/user'

const secret = process.env.JWT_SECRET as string

const route = express.Router()

route.post(
  '/api/user/signin',
  [
    body('email').isEmail().withMessage('Should be email'),
    body('password')
      .isLength({ min: 7 })
      .withMessage('Should be min 7 character'),
  ],
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // return res.status(404).send()
      throw new NotFoundError('Login failed')
    }

    const matched = await Password.compare(password, user!.password)
    if (!matched) {
      // return res.status(400).send()
      throw new BadRequestError('Incorrect Password')
    }

    user.set({ lastloginAt: new Date() })
    await user.save()

    const userJWT = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      secret
    )

    req.session = {
      jwt: userJWT,
    }
    // console.log(req.session)

    res.send(user)
  }
)

export { route as signInRoute }
