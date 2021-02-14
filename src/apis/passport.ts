/* 

How Passport works and its flow  in order
 1. Define strategy in passport.ts
       1. Find user email or id in DB, create the user otherwise
 2. Define Sign-up/Sign-in route is router.ts
 3. Initiate passport in app.ts by app.use(passport.initialize())
 4. Wire the passport with app's session by app.use(passport.session())
      --> Recommented to wire passport with session for post-authentication request 
          to use like req.isAuthenticated() 
      --> use cookie-session (KOSPI.v2 app) or express-session npm (KOSPI app)
 5. Once Sign-up/Sign-in route is accsessed, passport serialise() the user record 
    and i) save to DB and ii) put the user record to the session if wired 
 6. Then, the user record and session can be accesed within the app
 */

import passport from 'passport'
const GoogleStrategy = require('passport-google-oauth20').Strategy

import { User } from '../models/user'

const GOOGLE_CLIENT_ID =
  '298787624725-n2ba208qn22h4aa55gkahu9de51k53q2.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'h2kxPbT5qdy4fHftet5VqF5y'

// CALLBACK_URL has been defined in google side
const CALLBACK_URL = 'http://localhost:3000/auth/google/secrets'

// GOOGLE OAuth2 strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      User.findOne(
        {
          email: profile.emails[0].value,
        },
        function (err: any, user: any) {
          if (!user) {
            user = User.build({
              name: profile.displayName,
              email: profile.emails[0].value,
              provider: 'google',
              password: profile.id,
            })
            user.save(function (err: any) {
              if (err) console.log(err)
              return done(err, user)
            })
          } else {
            user.set({ lastloginAt: new Date() })
            user.save()
            return done(err, user)
          }
        }
      )
    }
  )
)

passport.serializeUser(function (user: any, done) {
  //  console.log(`===> SERIALISE: ${user}`)
  done(null, user)
  //done(null, { _id: user._id })
  // to serialise (casting) session only with User id and holding stocks , not just with user._id.
})

passport.deserializeUser(function (id, done) {
  //  console.log(`===>DE_SERIALISE: ${id}`)
  User.findById(id, function (err: any, user: any) {
    done(err, user)
  })
})

/* 

{
  id: '103905753894127452082',
  displayName: 'Seongsoo Yim',
  name: { familyName: 'Yim', givenName: 'Seongsoo' },
  emails: [ { value: 'seongsoo@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh6.googleusercontent.com/-dHRzdNjFw6k/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnIb8D3wYCoaPIkiJcWbzNX9ywu1w/s96-c/photo.jpg'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "103905753894127452082",\n' +
    '  "name": "Seongsoo Yim",\n' +
    '  "given_name": "Seongsoo",\n' +
    '  "family_name": "Yim",\n' +
    '  "picture": "https://lh6.googleusercontent.com/-dHRzdNjFw6k/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnIb8D3wYCoaPIkiJcWbzNX9ywu1w/s96-c/photo.jpg",\n' +
    '  "email": "seongsoo@gmail.com",\n' +
    '  "email_verified": true,\n' +
    '  "locale": "en"\n' +
    '}',
  _json: {
    sub: '103905753894127452082',
    name: 'Seongsoo Yim',
    given_name: 'Seongsoo',
    family_name: 'Yim',
    picture: 'https://lh6.googleusercontent.com/-dHRzdNjFw6k/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnIb8D3wYCoaPIkiJcWbzNX9ywu1w/s96-c/photo.jpg',
    email: 'seongsoo@gmail.com',
    email_verified: true,
    locale: 'en'
  }
} 
*/
