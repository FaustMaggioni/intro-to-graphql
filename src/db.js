import mongoose from 'mongoose'
import options from './config'

export const connect = (url = options.dbUrl, opts = {}) =>
{ return mongoose .connect(url, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err))
}
