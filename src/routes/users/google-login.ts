import express from 'express'
import jwt from 'jsonwebtoken'
import axios from 'axios'

import { User, UserAttrs } from '../../models/user'
import { BadRequestError } from '../../errors/custom-error'

const secret = process.env.JWT_SECRET

const route = express.Router()
// const route1 = express.Router()

route.get('/auth/google', (req, res) => {
  const googleAuthURL = process.env.GOOGLE_AUTH_URL as string
  const googleClinetId = process.env.GOOGLE_CLIENT_ID as string

  const redirect_uri = process.env.GOOGLE_AUTH_REDIRECT_URI_DEV as string //for Dev
  //const redirect_uri= process.env.GOOGLE_AUTH_REDIRECT_URI_PROD as string  //for PROD

  const response_type = 'code'
  const scope = 'email profile'
  const access_type = 'online'

  const redirectURL = `${googleAuthURL}?client_id=${googleClinetId}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&access_type=${access_type}`
  //   'https://accounts.google.com/o/oauth2/v2/auth?client_id=298787624725-n2ba208qn22h4aa55gkahu9de51k53q2.apps.googleusercontent.com&redirect_uri=http://localhost:5000/auth/google/secrets&response_type=code&scope=email&access_type=online'

  res.redirect(redirectURL)
})

/* 
***************************************************
 MOVED to React 
 - route1.get('/auth/google/secrets', async (req, res)
****************************************************

route1.get('/auth/google/secrets', async (req, res) => {
  //console.log(req.params)
  //console.log(req.query)
  console.log(req.query)

  const { code } = req.query
  const googleAuthURL = 'https://oauth2.googleapis.com/token'
  const client_id =
    '298787624725-n2ba208qn22h4aa55gkahu9de51k53q2.apps.googleusercontent.com'
  const redirect_uri = 'http://localhost:5000/auth/google/secrets'
  const client_secret = 'h2kxPbT5qdy4fHftet5VqF5y'
  const grant_type = 'authorization_code'
  //const access_type = 'online'

  try {
    const { data: access } = await axios.post(googleAuthURL, {
      client_id,
      redirect_uri,
      client_secret,
      grant_type,
      code,
    })

    //console.log(access)

    const { access_token, expires_in, scope, token_type, id_token } = access

    const googleAuthProfileURL = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`

    const { data: profile } = await axios.get(googleAuthProfileURL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    console.log(profile)

    const user = await findInDB(profile)

    const { _id, name, email } = user

    const userJWT = jwt.sign({ userId: _id, email, name }, secret)

    req.session = {
      jwt: userJWT,
    }
    // console.log(req.session)

    res.send(user)
  } catch (err) {
    console.log(err.response.data)
    throw new BadRequestError('google auth failed')
  }
})

const findInDB = async (profile: any) => {
  let user = await User.findOne({ email: profile.email })
  if (!user) {
    user = User.build({
      name: profile.name,
      email: profile.email,
      provider: 'google',
      password: profile.id,
    })

    await user.save()
  } else {
    user.set({ lastloginAt: new Date() })
    await user.save()
  }

  return user
}

 */

export {
  route as googleAuth,
  // route1 as googleAuthRedirect
}
