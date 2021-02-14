import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

it('fails 403 to show the stock details without authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  await request(app).get('/api/stockcode/1234567').send().expect(403)
})

it('passes 200 to show the stock detail with authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: '바텍',
    companyCode: '043150',
    market: 'KOSPI',
    currency: 'CNY',
    wics: '항공사',
  }

  const respPOST = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  const respGET = await request(app)
    .get(`/api/stockcode/${respPOST.body.companyCode}`)
    .set('Cookie', cookie)
    .expect(200)

  expect(respGET.body.companyCode).toEqual('043150')
})

it('fails 404 Not found to show the stock detail with incorrect stockcode id with authentication cookie', async () => {
  const cookie = await global.signin()
  const stockId = '12345'

  const resp = await request(app)
    .get(`/api/stockcode/${stockId}`)
    .set('Cookie', cookie)
    .expect(404)

  // console.log(resp.body)
})
