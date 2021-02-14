import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

it('fails 403 updating the stock without authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)
  const update = {
    evEbitda: 0.123,
    currentPrice: '120',
    intrinsic: 123,
  }

  await request(app).patch('/api/stockcode/1234567').send(update).expect(403)
})

it('passes 200 updating the stock detail with authentication', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: '제일기획',
    companyCode: '030000',
    market: 'KOSPI',
    currency: 'KRW',
    wics: '광고',
  }
  const updates = {
    evEbitda: 10.4,
    currentPrice: 2060000,
    intrinsic: 456010,
    comment: '언제 끝나나? ',
  }

  const respPOST = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  const patch = await request(app)
    .patch(`/api/stockcode/${respPOST.body.companyCode}`)
    .set('Cookie', cookie)
    .send(updates)
    .expect(200)
  // console.log(patch.body)

  expect(patch.body.currentPrice).toEqual(2060000)
})

it('fails 400 updating if the input fields is not numeric stock', async () => {
  const cookie = await global.signin()
  // console.log(cookie)
  const update = {
    evEbitda: 0.123,
    currentPrice: '120.x',
    intrinsic: 123,
  }

  const patch = await request(app)
    .patch(`/api/stockcode/1234567`)
    .set('Cookie', cookie)
    .send(update)
    .expect(400)
})
