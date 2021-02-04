import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

it('fails 403 deleteing the stock without authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  await request(app).delete('/api/stockcode/1234567').send().expect(403)
})

it('passes 200 deleting  the stock detail with authentication', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: 'NHN',
    companyCode: '123457',
    market: 'KOSPI',
    currency: 'CNY',
    wics: '번기전자',
  }

  const respPOST = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  const respELETE = await request(app)
    .delete(`/api/stockcode/${respPOST.body._id}`)
    .set('Cookie', cookie)
    .expect(200)
})

it('fails 404 Not found as the stock already deleted', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: 'NHN',
    companyCode: '123457',
    market: 'KOSPI',
    currency: 'CNY',
    wics: '번기전자',
  }

  const respPOST = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  const respELETE = await request(app)
    .delete(`/api/stockcode/${respPOST.body._id}`)
    .set('Cookie', cookie)
    .expect(200)

  const respGET = await request(app)
    .get(`/api/stockcode/${respPOST.body._id}`)
    .set('Cookie', cookie)
    .expect(404)
})
