import mongoose from 'mongoose'

import { app } from '@/app'
import { OrderCancelledConsumer } from '@/events/consumers/order-cancelled-consumer'
import { OrderCreatedConsumer } from '@/events/consumers/order-created-consumer'
import { ticketCreatedPublisher } from '@/events/publishers/ticket-created-publisher'
import { ticketUpdatedPublisher } from '@/events/publishers/ticket-updated-publisher'
import { natsWrapper } from '@/nats-wrapper'

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
    void ticketCreatedPublisher.init(natsWrapper.client)
    void ticketUpdatedPublisher.init(natsWrapper.client)

    // consumers
    void (await new OrderCreatedConsumer().init(natsWrapper.client)).consume()
    void (await new OrderCancelledConsumer().init(natsWrapper.client)).consume()
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log('listening to port 3000!')
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start()
