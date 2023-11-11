export const natsWrapper = {
  client: {
    jetstreamManager: jest.fn().mockImplementation(() => {
      return {
        streams: {
          get(name: string) {
            return this
          },
          then(callback: (stream: unknown) => void) {
            return this
          },
          catch: jest
            .fn()
            .mockImplementation((callback: (error: unknown) => void) => {
              return this
            })
        }
      }
    }),
    jetstream: jest.fn().mockImplementation(() => {
      return {
        consumers: {
          get(name: string, queue: string) {
            return this
          },
          then(callback: (stream: unknown) => void) {
            return this
          },
          catch: jest
            .fn()
            .mockImplementation((callback: (error: unknown) => void) => {
              return this
            })
        },
        publish: jest
          .fn()
          .mockImplementation(
            (subject: string, payload: unknown, opts: unknown) => {}
          )
      }
    })
  }
}
