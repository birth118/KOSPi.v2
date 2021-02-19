import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import jwt from 'jsonwebtoken'
import { BadRequestError } from '../../errors/custom-error'

import { validate } from '../../middleware/validate'
import { User, UserAttrs } from '../../models/user'

const secret = process.env.JWT_SECRET as string

const route = express.Router()

route.post(
  '/api/user/signup',
  [
    body('name').not().isEmpty().withMessage('Name must be provided'),
    body('email').isEmail().withMessage('Should be email'),
    body('password')
      .isLength({ min: 7 })
      .withMessage('Should be min 7 character'),
    body('provider').not().isEmpty().withMessage('Provider must be provided'),
  ],
  validate,
  async (req: Request, res: Response) => {
    const { name, email, password, provider } = req.body

    if (await User.findOne({ email })) {
      throw new BadRequestError('Email in use')
    }

    const login: UserAttrs = {
      email,
      password,
      name,
      provider, // Use is created by email method. Not by google auth
    }

    //console.log(login)

    const user = User.build(login)
    try {
      await user.save()

      // const holdingStocks = [
      //   {
      //     companyCode: '123457',
      //     holdings: 0,
      //     avgBuyingPrice: 0,
      //   },
      // ]

      const userJWT = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        secret
      )
      //console.log(userJWT)

      req.session = {
        jwt: userJWT,
      }
      //console.log(req.session)
      // console.log(userJWT)

      res.status(201).send(user)

      // 201: Therequest succeeded and has led to the creation of a resource
    } catch (err) {
      console.log(err)
      res.status(500)
    }
  }
)

export { route as signUpRoute }
