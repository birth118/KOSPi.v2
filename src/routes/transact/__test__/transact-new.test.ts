import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

import { StockCode } from '../../../models/stockCode'

const newStockcode = async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: '에스텍',
    companyCode: '069510',
    market: 'KOSDAQ',
    currency: 'KRW',
    wics: '전자장비와기기',
  }

  const { body } = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  return { body, cookie }
}

// it('test mock', async () => {
//   const { body, cookie } = await newStockcode()
//   // const resp = await request(app).get('/api/stockcode/').send()
//   const resp = await request(app)
//     .get('/api/stockcode')
//     .set('Cookie', cookie)
//     .send()
//   // .expect(200)
// })

it('fails 403 without authentication cookie', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const transact = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1500,
    amount: 30,
    buyOrSell: 'BUY',
    per: 12.3,
    pbr: 1.4,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const resp = await request(app)
    .post(`/api/transact/`)
    .send(transact)
    .expect(403)
  //console.log(resp.body)
})

it('fails 400 requuest validation with authentication cookie', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const transact = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1500,
    amount: 30,
    buyOrSell: '',
    per: '12.3',
    pbr: 1.4,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const resp = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact)
    .expect(400)
  //console.log(resp.body)
})

it('passes 201 initial save() with authentication cookie', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const transact = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1500,
    amount: 30,
    buyOrSell: 'BUY',
    per: '12.3',
    pbr: 1.4,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const resp = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact)
    .expect(201)
  //console.log(resp.body)

  //    .expect(200)

  //console.log(respGET.body)
})

it('passes with avdBuyPrice and holdings pre-save() in BUY stockCode table with authentication cookie', async () => {
  const { body, cookie } = await newStockcode()
  //console.log(cookie)

  const transact1 = {
    companyName: body.companyName,
    companyCode: body.companyCode,
    price: 1000,
    amount: 30,
    buyOrSell: 'BUY',
    per: 100,
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
    per: 200,
    pbr: 2,
    kospi: 3120.03,
    kosdaq: 1030.01,
  }

  const resp1 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact1)
    .expect(201)

  const resp1GET = await request(app)
    .get(`/api/stockcode/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)
  //console.log(resp1GET.body)

  const resp2 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact2)
    .expect(201)

  const resp2GET = await request(app)
    .get(`/api/stockcode/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)
  // console.log(resp2GET.body)
})

it('passes with profit and profilePercent and holdings pre-save() in SELL StockCode & Transact table with authentication cookie', async () => {
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

  // const stock = await StockCode.findOne({
  //   userId: body.userId,
  //   companyCode: body.companyCode,
  // })
  // console.log(stock)

  const resp1GET = await request(app)
    .get(`/api/stockcode/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  const resp2 = await request(app)
    .post(`/api/transact/`)
    .set('Cookie', cookie)
    .send(transact2)
    .expect(201)

  const resp2GET = await request(app)
    .get(`/api/stockcode/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)
  // console.log(resp2GET.body)

  await request(app) // To poupluate req.currentUser!.holdingStocks
    .get(`/api/stockcode/`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  const resp3GET = await request(app)
    .get(`/api/stockcode/${body.companyCode}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  // console.log(resp3.body)
})
