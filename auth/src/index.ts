import mongoose from 'mongoose'

import { app } from '@/app'

const start = async (): Promise<void> => {
  const jwtKey = process.env.JWT_KEY ?? ''
  if (jwtKey === '') {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('connected to mongodb')
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log('listening to port 3000!')
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start()
