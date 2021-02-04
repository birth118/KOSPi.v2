import mongoose from 'mongoose'
import { StockCode } from './stockCode'
import { BuyOrSell } from './buyOrSell-enum'
import { BadRequestError } from '../errors/custom-error'

interface transactAttr {
  userId: string
  companyCode: string
  companyName: string
  price: number
  amount: number
  buyOrSell: BuyOrSell
}

interface transactDoc extends mongoose.Document {
  userId: string
  companyCode: string
  price: number
  amount: number
  buyOrSell: BuyOrSell
  per: number
  pbr: number
}

interface transactModel extends mongoose.Model<transactDoc> {
  build(attr: transactAttr): transactDoc
}

const transactSchema = new mongoose.Schema<transactDoc, transactModel>(
  {
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
    buyOrSell: {
      type: BuyOrSell,
      default: BuyOrSell.BUY,
    },
    price: { type: Number, min: 0, required: true },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    per: {
      type: Number,
      default: 0,
    },
    pbr: {
      type: Number,
      default: 0,
    },
    kospi: {
      type: Number,
      default: 3000,
      required: true,
    },
    kosdaq: {
      type: Number,
      default: 1000,
    },
    comment: {
      type: String,
      trim: true,
    },
    profit: {
      type: Number,
      default: 0,
    },
    profitPercent: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

transactSchema.statics.build = (attrs) => {
  return new Transact(attrs)
}
transactSchema.pre('save', async function (next) {
  // to encryt the passord when user creation
  const transact = this
  //console.log(transact)

  const stock = await StockCode.findOne({
    companyCode: transact.companyCode,
    userId: transact.userId,
  })

  // console.log(stock)

  let totAmount = -1
  let avgBuyingPrice = -1
  let avgPER = -1
  let avgPBR = -1

  if (transact.buyOrSell === BuyOrSell.BUY) {
    totAmount = stock!.holdings + transact.amount
    avgBuyingPrice =
      (stock!.avgBuyingPrice * stock!.holdings +
        transact.amount * transact.price) /
      totAmount
    avgPER =
      (stock!.avgPER * stock!.holdings + transact.amount * transact.per) /
      totAmount
    avgPBR =
      (stock!.avgPBR * stock!.holdings + transact.amount * transact.pbr) /
      totAmount
  } else {
    totAmount = stock!.holdings - transact.amount
    if (totAmount < 0) {
      throw new BadRequestError('totAmount < 0')
    } else if (totAmount === 0) {
      avgBuyingPrice = 0
      avgPER = 0
      avgPBR = 0
    } else {
      avgBuyingPrice = stock!.avgBuyingPrice

      // 2020 10 20 Defect #1 : incorrect PER calculation on Selling ( found by현대글로비스)
      // avgPER = ((stock!.avgPER * stock!.holdings) - (transact.amount * transact.per)) / totAmount
      // avgPBR = ((stock!.avgPBR * stock!.holdings) - (transact.amount * transact.pbr)) / totAmount
      avgPER = stock!.avgPER
      avgPBR = stock!.avgPBR
    }
  }

  stock!.set({
    holdings: totAmount,
    avgBuyingPrice,
    avgPER,
    avgPBR,
    previousPrice: transact.price,
    previousDate: new Date(),
  })

  // //reconciliate stockCode
  // const update = await StockCode.findOneAndUpdate(
  //   {
  //     companyCode: transact.companyCode,
  //     uiserId: transact.userId,
  //   },
  //   {
  //     holdings: totAmount,
  //     avgBuyingPrice,
  //     avgPER,
  //     avgPBR,
  //     previousPrice: transact.price,
  //     previousDate: new Date(),
  //   }
  //   // (err: any) => {
  //   //   if (err) {
  //   //     throw new BadRequestError('Error on StockCode.findOneAndUpdate()')
  //   //   }
  //   // }
  // )

  stock!.save()

  next()
})

const Transact = mongoose.model<transactDoc, transactModel>(
  'Transact',
  transactSchema
)

export { Transact }
