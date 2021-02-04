import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { User, UserAttrs } from '../../models/user'

const secret = process.env.JWT_SECRET || 'SECRET'

const route = express.Router()

// Login via google strategy
route.get(
  '/auth/google',
  // google will give us 'profile'
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

route.get(
  '/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/' }),
  // If it is authenticated locally in our app, and User.findOrCreate() will run
  function (req, res) {
    // Successful authentication, redirect home
    // console.log(`===>ROUTE:Get: ${req.user}`)
    const { name, email } = req.user as UserAttrs

    const userJWT = jwt.sign({ email, name }, secret)

    req.session = {
      jwt: userJWT,
    }

    res.send(req.user)
  }
)

export { route as googlePassport }

/* 
_id:5e16b1ec2b61106a50aace97
googleId:"103905753894127452082"
displayName:"Seongsoo Yim"
__v:0 
*/
