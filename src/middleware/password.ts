import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

/* 
Create Password
1.  create random salt
2.  generate hash with the salt

Create validator

 */
const scryptAsync = promisify(scrypt)

export class Password {
  static toHash = async (password: string) => {
    const salt = randomBytes(8).toString('hex')
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer
    return `${buffer.toString('hex')}.${salt}`
  }

  static compare = async (password: string, encrypted: string) => {
    const [hashed, salt] = encrypted.split('.')
    // console.log(hashed)
    // console.log(salt)
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer
    return buffer.toString('hex') === hashed ? true : false
  }
}

//  ** TEST CODE
//
// const hash = async () => {
//   const hashedPassword = await Password.toHash('123')

//   console.log(hashedPassword)
// }

// // hash()
// const hashed =
//   '29df20da9576687543d6ba8c72a55e1877a0797a1778f18bfa45fcbb8b7e02d436ad36ac03755580a79ebe73c88083573ad32b6df142219756c501bff4795d4f.7d7d9b62ca7b9965'
// const compare = async () => {
//   console.log(await Password.compare('123', hashed))
// }

// compare()
