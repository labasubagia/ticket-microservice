import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

declare global {
  function fakeSignIn(): string
}

let mongo: MongoMemoryServer

jest.mock('@/nats-wrapper')

beforeAll(async () => {
  jest.clearAllMocks()
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

globalThis.fakeSignIn = () => {
  const id = new mongoose.mongo.ObjectId()
  const payload = { id, email: 'test@test.com' }
  const token = jwt.sign(payload, process.env.JWT_KEY ?? '')
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return `session=${base64}; path=/; httponly`
}
