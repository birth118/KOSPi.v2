import mongoose from 'mongoose'

import request from 'supertest'
import app from '../../../app'
import { BuyOrSell } from '../../../models/buyOrSell-enum'

import { StockCode } from '../../../models/stockCode'

const newStockcode = async (
  companyName: string,
  companyCode: string,
  cookie: any
) => {
  // const cookie = await global.signin()
  // console.log(cookie)

  const stockCode1 = {
    companyName,
    companyCode,
    market: 'KOSPI',
    currency: 'KRW',
    wics: '번기전자',
  }

  const { body } = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode1)
    .expect(201)

  return { body }
}

const newTransaction = async (
  companyName: string,
  companyCode: string,
  price: number,
  amount: number,
  buyOrSell: BuyOrSell,
  cookie: any
) => {
  // console.log(cookie)

  const transact1 = {
    companyName,
    companyCode,
    price,
    amount,
    buyOrSell,
    per: 10,
    pbr: 1,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const { body } = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact1)
    .expect(201)

  return { body }
}

it('passes with sorted order of allocation', async () => {
  const cookie = await global.signin()

  const { body } = await newStockcode('삼성', '1234567', cookie)
  await newTransaction(
    body.companyName,
    body.companyCode,
    1000,
    30,
    BuyOrSell.BUY,
    cookie
  )
  await newTransaction(
    body.companyName,
    body.companyCode,
    2000,
    10,
    BuyOrSell.BUY,
    cookie
  )

  const resp = await newStockcode('NHN', '62355678', cookie)
  await newTransaction(
    resp.body.companyName,
    resp.body.companyCode,
    1000,
    40,
    BuyOrSell.BUY,
    cookie
  )

  const resp1 = await newStockcode('SK', '62355578', cookie)
  await newTransaction(
    resp1.body.companyName,
    resp1.body.companyCode,
    1000,
    65,
    BuyOrSell.BUY,
    cookie
  )

  //console.log(cookie)

  const resp3GET = await request(app)
    .get(`/api/stockcode`)
    .set('Cookie', cookie)
    .send()
  //  .expect(200)

  console.log(
    resp3GET.body.map((item: any) => {
      return item.total
    })
  )
})
