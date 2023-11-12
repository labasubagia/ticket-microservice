import { type ConnectionOptions, Queue, Worker } from 'bullmq'

import { expirationCompletePublisher } from '@/events/publishers/expiration-complete-publisher'

interface Payload {
  orderId: string
}

export const QUEUE_ORDER_EXPIRATION = 'order.expiration'

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT)
}

export const expirationQueue = new Queue<Payload>(QUEUE_ORDER_EXPIRATION, {
  connection
})

export const expirationWorker = new Worker<Payload>(
  QUEUE_ORDER_EXPIRATION,
  async (job) => {
    await expirationCompletePublisher.publish({ orderId: job.data.orderId })
  },
  { connection }
)

expirationWorker.on('ready', () => {
  console.log(`worker for queue ${QUEUE_ORDER_EXPIRATION} is ready`)
})
