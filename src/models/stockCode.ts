import { Market } from './market-enum'
import { Currency } from './currency-enum'

import { UserDoc } from './user'
import mongoose from 'mongoose'

import { NotFoundError } from '../errors/custom-error'

interface StockcodeAttr {
  userId: string
  companyCode: string
  companyName: string
  market: string
  currency: string
  wics: string
}

interface StockCodeDoc extends mongoose.Document {
  userId: string
  companyCode: string
  companyName: string
  holdings: number
  avgBuyingPrice: number
  avgPER: number
  avgPBR: number
}

interface StockCodeModel extends mongoose.Model<StockCodeDoc> {
  build(attrs: StockcodeAttr): StockCodeDoc
}

const stockCodeSchema = new mongoose.Schema<StockCodeDoc, StockCodeModel>(
  {
    userId: {
      type: String,
      require: true,
    },
    companyCode: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      require: true,
      trim: true,
    },
    holdings: {
      type: Number,
      default: 0,
    },
    avgBuyingPrice: {
      type: Number,
      default: 0,
    },
    avgPER: {
      type: Number,
      default: 0,
    },
    avgPBR: {
      type: Number,
      default: 0,
    },
    evEbitda: {
      type: Number,
      default: 0,
    },
    previousPrice: {
      type: Number,
      default: 0,
    },
    previousDate: {
      type: Date,
      default: new Date(),
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    intrinsic: {
      type: Number,
      default: 0,
    },
    comment: String,
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      default: Currency.KRW,
    },
    market: {
      type: String,
      enum: Object.values(Market),
      default: Market.KOSPI,
      required: true,
    },
    wics: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

stockCodeSchema.statics.findStockList = async () => {
  const stocks = await StockCode.find({})
  if (!stocks) {
    throw new NotFoundError('No stock registered')
  }

  return stocks
}

stockCodeSchema.statics.build = (attrs: StockcodeAttr) => {
  return new StockCode(attrs)
}

const StockCode = mongoose.model<StockCodeDoc, StockCodeModel>(
  'StockCode',
  stockCodeSchema
)

export { StockCode, StockcodeAttr, StockCodeDoc }
