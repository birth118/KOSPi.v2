import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload
//     }
//   }
// }

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}

process.env.JWT_SECRET = 'SECRET'

let mongo: any

beforeAll(async () => {
  mongo = new MongoMemoryServer()
  const url = await mongo.getUri()
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

// global.signin = async () => {
//   const name = 'james'
//   const email = 'test@test.com'
//   const password = '12345678'
//   const resp = await request(app)
//     .post('/api/user/signup')
//     .send({ name, email, password })
//     .expect(201)

//   const cookie = resp.get('Set-Cookie')
//   // console.log(cookie)

//   return cookie
// }

global.signin = async () => {
  const name = 'james'
  const email = 'test@test.com'
  // const password = '12345678'
  const userId = mongoose.Types.ObjectId().toHexString()
  // const holdingStocks = {
  //   companyCode: '123457',
  //   holdings: 0,
  //   avgBuyingPrice: 0,
  // }

  const userJWT = await jwt.sign(
    { userId, name, email },
    process.env.JWT_SECRET!
  )
  //console.log(userJWT)

  const session = {
    jwt: userJWT,
  }

  // const userJWT =
  //   'eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlTV1FpT2lJMk1ERmpOemxoTlRNME5UQTVNR0pqTWpnek9EZzROR01pTENKbGJXRnBiQ0k2SW5SbGMzUkFkR1Z6ZEM1amIyMGlMQ0p1WVcxbElqb2lhbUZ0WlhNaUxDSm9iMnhrYVc1blUzUnZZMnR6SWpwYmV5SmpiMjF3WVc1NVEyOWtaU0k2SWpFeU16UTFOeUlzSW1odmJHUnBibWR6SWpvd0xDSmhkbWRDZFhscGJtZFFjbWxqWlNJNk1IMWRMQ0pwWVhRaU9qRTJNVEkwTnpnNE9EVjkuZlk1SThEWkNhZ0ZUdkkxVzBUVi1nSGpSYlNsSktBNzd1QVB0NGdsZDRpcyJ9'
  // const cookieString = `kospi-session=${userJWT}; path=/; expires=Thu, 04 Feb 2021 05:11:29 GMT; httponly`
  // const cookie = [cookieString]
  // const cookie = [
  //   'kospi-session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlTV1FpT2lJMk1ERmpOemxoTlRNME5UQTVNR0pqTWpnek9EZzROR01pTENKbGJXRnBiQ0k2SW5SbGMzUkFkR1Z6ZEM1amIyMGlMQ0p1WVcxbElqb2lhbUZ0WlhNaUxDSm9iMnhrYVc1blUzUnZZMnR6SWpwYmV5SmpiMjF3WVc1NVEyOWtaU0k2SWpFeU16UTFOeUlzSW1odmJHUnBibWR6SWpvd0xDSmhkbWRDZFhscGJtZFFjbWxqWlNJNk1IMWRMQ0pwWVhRaU9qRTJNVEkwTnpnNE9EVjkuZlk1SThEWkNhZ0ZUdkkxVzBUVi1nSGpSYlNsSktBNzd1QVB0NGdsZDRpcyJ9; path=/; expires=Fri, 05 Feb 2021 22:48:05 GMT; httponly',
  // ]

  // return cookie

  // Turn that session to JSON
  const sessionJSON = JSON.stringify(session)

  // Take the JSON string  and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`kospi-session=${base64}`]
}
