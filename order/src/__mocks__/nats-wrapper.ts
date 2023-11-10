export const natsWrapper = {
  client: {
    jetstreamManager: jest.fn().mockImplementation(() => {
      return {
        streams: {
          get(name: string) {
            return this
          },
          catch: jest
            .fn()
            .mockImplementation((callback: (error: unknown) => void) => {})
        }
      }
    }),
    jetstream: jest.fn().mockImplementation(() => {
      return {
        publish: jest
          .fn()
          .mockImplementation(
            (subject: string, payload: unknown, opts: unknown) => {}
          )
      }
    })
  }
}
