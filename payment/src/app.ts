import 'express-async-errors'

import { currentUser, errorHandler, NotFoundError } from '@klstickets/common'
import cookieSession from 'cookie-session'
import express, { json } from 'express'

import { createChargeRouter } from '@/routes/create'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)
app.use(currentUser)

app.use(createChargeRouter)

app.use(async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
