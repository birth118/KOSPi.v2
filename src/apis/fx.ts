import axios from 'axios'

import { BadRequestError } from '../errors/custom-error'

interface Currency {
  rates: any
  base: string
  dates: Date
}

const fxToFromEURPromise = (): Promise<Currency> => {
  return new Promise((resolve, reject) => {
    // setTimeout(()=>{
    //     if(num1 < 0 || num2 < 0){
    //         return reject('number to be non-negative')
    //     }
    //     resolve(num1 + num2)
    // },2000)

    const url = 'https://api.exchangeratesapi.io/latest'

    // request({ url, json: true }, (error, data) => {
    //   if (error) {
    //     return reject(
    //       `Currency API Error: cannot connect currency service: ${url}`
    //     )
    //   } else if (data.body.error) {
    //     return reject(`Currency API Error: ${data.body.error}`)
    //   }
    //   resolve(data.body.rates)
    // })

    axios
      .get(url)
      .then(({ data }) => {
        return resolve(data)
      })
      .catch((error) => {
        return reject('Currency API Error')
      })
  })
}

export const currencyTable = async () => {
  const currency = await fxToFromEURPromise()

  let currencies = await fxToFromEURPromise()
  const currenciesTable = {
    USD: currencies.rates.KRW / currencies.rates.USD,
    CNY: currencies.rates.KRW / currencies.rates.CNY,
    KRW: 1,
  }

  return currenciesTable
}

// Test

// const start = async () => {
//   const currency = await fxToFromEURPromise()
//   console.log(currency)
// }

// start()
