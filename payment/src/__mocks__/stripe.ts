export const stripeId = 'mock_stripe_id'

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: stripeId })
  }
}
