import { mongo } from 'mongoose'

export const stripeId = new mongo.ObjectId().toString()

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: stripeId })
  }
}
