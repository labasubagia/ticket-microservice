import express, { json } from 'express'
import cookieSession from 'cookie-session'
import 'express-async-errors'

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signUpRouter } from './routes/sign-up'
import { signOutRouter } from './routes/sign-out'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.use(async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
