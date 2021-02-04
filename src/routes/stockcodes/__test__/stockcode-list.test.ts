import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

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
