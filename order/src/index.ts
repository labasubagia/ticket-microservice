import mongoose from 'mongoose'

import { app } from '@/app'
import { natsWrapper } from '@/nats-wrapper'

import { TicketCreatedConsumer } from './events/consumers/ticket-created-consumer'
import { TicketUpdatedConsumer } from './events/consumers/ticket-updated-consumer'
import { orderCreatedPublisher } from './events/publishers/order-created-publisher'

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

    process.on('SIGINT', async () => {
      await natsWrapper.client.close()
    })
    process.on('SIGTERM', async () => {
      await natsWrapper.client.close()
    })

    // publishers
    void orderCreatedPublisher.init(natsWrapper.client)
    void orderCreatedPublisher.init(natsWrapper.client)

    // consumers
    void (await new TicketCreatedConsumer().init(natsWrapper.client)).consume()
    void (await new TicketUpdatedConsumer().init(natsWrapper.client)).consume()
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log('listening to port 3000!')
  })
}

void start()
