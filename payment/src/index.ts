import mongoose from 'mongoose'

import { app } from '@/app'
import { natsWrapper } from '@/nats-wrapper'

import { OrderCreatedConsumer } from './events/consumers/order-created-consumer'

const start = async (): Promise<void> => {
  const jwtKey = process.env.JWT_KEY ?? ''
  if (jwtKey === '') {
    throw new Error('JWT_KEY must be defined')
  }

  const mongoUri = process.env.MONGO_URI ?? ''
  if (mongoUri === '') {
    throw new Error('MONGO_URI must be defined')
  }

  const natsServers = (process.env.NATS_SERVERS ?? '').split(',')
  if (natsServers.length === 0) {
    throw new Error('NATS_SERVERS must be defined')
  }

  try {
    // mongo
    await mongoose.connect(mongoUri)
    console.log('connected to mongodb')

    // nats
    await natsWrapper.connect(natsServers)

    natsWrapper.client.closed().catch((error) => {
      console.log('NATS closed', error.message)
      process.exit()
    })

    // consumers
    const consumers = [new OrderCreatedConsumer()]
    consumers.forEach(async (consumer) => {
      await consumer.init(natsWrapper.client)
      void consumer.consume()
    })

    // server
    const server = app.listen(3000, () => {
      console.log('listening to port 3000!')
    })

    const onClose = async (signal: NodeJS.Signals): Promise<void> => {
      await natsWrapper.client.close()
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
