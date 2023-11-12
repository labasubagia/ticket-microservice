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

    process.on('SIGINT', onClose)
    process.on('SIGTERM', onClose)
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start()
