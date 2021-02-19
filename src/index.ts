import app from './app'
import mongoose from 'mongoose'

const mongodb = process.env.MONGO_DEV as string

const port = process.env.PORT

const start = async () => {
  try {
    await mongoose.connect(mongodb, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log('MONGO DB connected')
  } catch (err) {
    console.log(err)
    process.exit(1) // Exit process with failure
  }

  app.listen(port, () => {
    console.log('Express server up:', port)
  })
}

start()
