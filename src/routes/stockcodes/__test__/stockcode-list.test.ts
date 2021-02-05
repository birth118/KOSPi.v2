import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'
import { BuyOrSell } from '../../../models/buyOrSell-enum'
import { Currency } from '../../../models/currency-enum'

it('fails 403 to create a stock holdings for the user without authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  await request(app).get('/api/stockcode/').send().expect(403)
})

it('passes 200 to list 1 stock list for the user with authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: 'NHN',
    companyCode: '123457',
    market: 'KOSPI',
    currency: 'KRW',
    wics: '번기전자',
  }

  await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  const resp = await request(app)
    .get('/api/stockcode/')
    .set('Cookie', cookie)
    .expect(200)
  // console.log(resp.body)

  expect(resp.body.length).toEqual(1)
})

it('passes 200 to list 0 stock list for the user with authentication cookie', async () => {
  const cookie = await global.signin()

  const resp = await request(app)
    .get('/api/stockcode/')
    .set('Cookie', cookie)
    .expect(200)
  // console.log(resp.body)

  expect(resp.body.length).toEqual(0)
})

///////////////////////////////////////////////

const newStockcode = async (
  companyName: string,
  companyCode: string,
  cookie: any,
  currentPrice: number,
  currency: Currency
) => {
  // const cookie = await global.signin()
  // console.log(cookie)

  const stockCode1 = {
    companyName,
    companyCode,
    market: 'KOSPI',
    currency,
    wics: '번기전자',
    currentPrice,
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

it('List up each holding details with its total value and portion in portfolio', async () => {
  const cookie = await global.signin()

  const { body } = await newStockcode(
    '삼성',
    '1234567',
    cookie,
    1200,
    Currency.KRW
  )
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

  const resp = await newStockcode('NHN', '62355678', cookie, 1200, Currency.KRW)
  await newTransaction(
    resp.body.companyName,
    resp.body.companyCode,
    1000,
    40,
    BuyOrSell.BUY,
    cookie
  )

  const resp1 = await newStockcode('SK', '62355578', cookie, 1200, Currency.KRW)
  await newTransaction(
    resp1.body.companyName,
    resp1.body.companyCode,
    1000,
    65,
    BuyOrSell.BUY,
    cookie
  )

  //console.log(cookie)

  const respGET = await request(app)
    .get('/api/stockcode')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(respGET.body.length).toEqual(3)
  // console.log(respGET.body)
})
