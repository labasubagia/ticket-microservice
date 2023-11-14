import { OrderCreatedConsumer } from '@/events/consumers/order-created-consumer'
import { expirationCompletePublisher } from '@/events/publishers/expiration-complete-publisher'
import { natsWrapper } from '@/nats-wrapper'

const start = async (): Promise<void> => {
  const natsServers = (process.env.NATS_SERVERS ?? '').split(',')
  if (natsServers.length === 0) {
    throw new Error('NATS_SERVERS must be defined')
  }

  try {
    // nats
    await natsWrapper.connect(natsServers)

    natsWrapper.client.closed().catch((error) => {
      console.log('NATS closed', error.message)
      process.exit()
    })

    const onClose = async (signal: NodeJS.Signals): Promise<void> => {
      await natsWrapper.client.close()
      process.exit()
    }

    // publishers
    const publishers = [expirationCompletePublisher]
    for (const publisher of publishers) {
      await publisher.init(natsWrapper.client)
    }

    // consumers
    const consumers = [new OrderCreatedConsumer()]
    for (const consumer of consumers) {
      await consumer.init(natsWrapper.client)
      void consumer.consume()
    }

    console.log('expiration service started')

    process.on('SIGINT', onClose)
    process.on('SIGTERM', onClose)
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

void start()
