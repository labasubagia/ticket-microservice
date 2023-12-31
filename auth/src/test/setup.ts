import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '@/app'

declare global {
  function signUp(params?: {
    email?: string
    password?: string
  }): Promise<string>
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  await Promise.all([
    collections.map(async (collection) => await collection.deleteMany({}))
  ])
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

globalThis.signUp = async ({
  email = 'test@test.com',
  password = '12345'
} = {}) => {
  const response = await request(app)
    .post('/api/users/sign-up')
    .send({ email, password })
    .expect(201)
  const cookie = response.get('Set-Cookie')
  return cookie[0]
}
