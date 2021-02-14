import app from './app'
import mongoose from 'mongoose'

const dbName = 'myStock-v2'
const MONGO_DEV = `mongodb+srv://seongsoo-admin:happy2me@cluster0.72fbe.mongodb.net/${dbName}?retryWrites=true&w=majority`
const secret = process.env.JWT_SECRET || 'SECRET'

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await mongoose.connect(MONGO_DEV, {
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
