import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

import { StockCode } from '../../../models/stockCode'

const newStockcode = async () => {
  //const cookie = await global.signin()
  const cookie = [
    'kospi-session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlTV1FpT2lJMk1ERmpOemxoTlRNME5UQTVNR0pqTWpnek9EZzROR01pTENKbGJXRnBiQ0k2SW5SbGMzUkFkR1Z6ZEM1amIyMGlMQ0p1WVcxbElqb2lhbUZ0WlhNaUxDSm9iMnhrYVc1blUzUnZZMnR6SWpwYmV5SmpiMjF3WVc1NVEyOWtaU0k2SWpFeU16UTFOeUlzSW1odmJHUnBibWR6SWpvd0xDSmhkbWRDZFhscGJtZFFjbWxqWlNJNk1IMWRMQ0pwWVhRaU9qRTJNVEkwTnpnNE9EVjkuZlk1SThEWkNhZ0ZUdkkxVzBUVi1nSGpSYlNsSktBNzd1QVB0NGdsZDRpcyJ9; path=/; expires=Fri, 05 Feb 2021 22:48:05 GMT; httponly',
  ]

  // console.log(cookie)

  const stockCode = {
    companyName: 'NHN',
    companyCode: '123457',
    market: 'KOSPI',
    currency: 'CNY',
    wics: '번기전자',
  }

  const { body } = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  return { body, cookie }
}

it('fails 403 without authentication cookie', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const resp = await request(app)
    .get(`/api/transact/${body.companyCode}`)
    .expect(403)
  //console.log(resp.body)
})

it('passes with 3 documents of 2 BUYS  & 1 SELL in  Transact table', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const transact1 = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1000,
    amount: 30,
    buyOrSell: 'BUY',
    per: 10,
    pbr: 1,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }
  const transact2 = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1500,
    amount: 20,
    buyOrSell: 'BUY',
    per: 10.5,
    pbr: 1.2,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const transact3 = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1500,
    amount: 30,
    buyOrSell: 'SELL',
    per: 15,
    pbr: 1.2,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const resp1 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact1)
    .expect(201)

  // const resp1GET = await request(app)
  //   .get(`/api/stockcode/${body.userId}`)
  //   .set('Cookie', cookie)
  //   .send()
  //   .expect(200)
  // //console.log(resp1GET.body)

  const resp2 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact2)
    .expect(201)

  // const resp2GET = await request(app)
  //   .get(`/api/stockcode/${body.userId}`)
  //   .set('Cookie', cookie)
  //   .send()
  //   .expect(200)
  // // console.log(resp2GET.body)

  const resp3 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact3)
  //  .expect(201)

  const resp3GET = await request(app)
    .get(`/api/transact/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  //console.log(resp3.body)
})
