import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app'

it('fails 403 to create a stockcode without authentication cookie', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: '삼성전자',
    companyCode: '123456',
    market: 'KOSPI',
    currency: 'KRW',
    wics: '번기전자',
  }

  await request(app).post('/api/stockcode/').send(stockCode).expect(403)
})

it('succeeds 201  to create a stockcode', async () => {
  const cookie = await global.signin()
  // console.log(cookie)

  const stockCode = {
    companyName: '삼성전자',
    companyCode: '123456',
    market: 'KOSPI',
    currency: 'KRW',
    wics: '번기전자',
  }

  const resp = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(201)

  expect(resp.body.companyCode).toEqual('123456')
})

it('fails 400 to create a stockcode with incorrect market code', async () => {
  const cookie = await global.signin()
  const stockCode = {
    companyName: '삼성전자',
    companyCode: '123456',
    market: 'KOSI',
    currency: 'KRW',
    wics: '번기전자',
  }

  const resp = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(400)
})

it('fails 400 to create a stockcode with incorrect curreny code', async () => {
  const cookie = await global.signin()
  const stockCode = {
    companyName: '삼성전자',
    companyCode: '123456',
    market: 'KOSDAQ',
    currency: 'JPY',
    wics: '번기전자',
  }

  const resp = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(400)
})

it('errors 409 duplicated stockcode', async () => {
  const cookie = await global.signin()
  const stockCode = {
    companyName: '삼성전자',
    companyCode: '123456',
    market: 'KOSPI',
    currency: 'KRW',
    wics: '번기전자',
  }

  await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)

  const resp = await request(app)
    .post('/api/stockcode/')
    .set('Cookie', cookie)
    .send(stockCode)
    .expect(409)
})
