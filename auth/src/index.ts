import mongoose from 'mongoose'

import { app } from '@/app'

const start = async (): Promise<void> => {
  const jwtKey = process.env.JWT_KEY ?? ''
  if (jwtKey === '') {
    throw new Error('JWT_KEY must be defined')
  }

  const mongoUri = process.env.MONGO_URI ?? ''
  if (mongoUri === '') {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('connected to mongodb')

    const server = app.listen(3000, () => {
      console.log('listening to port 3000!')
    })

    const onClose = async (signal: NodeJS.Signals): Promise<void> => {
      await mongoose.connection.close()
      server.close(() => {
        console.log('Http server closed')
        process.exit()
      })
    }

    process.on('SIGINT', onClose)
    process.on('SIGTERM', onClose)
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

void start()
