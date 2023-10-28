import { BadRequestError } from '@/errors/bad-request-error'
import { validateRequest } from '@/middlewares/validate-request'
import { User } from '@/models/user'
import { compare } from '@/services/password'
import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/api/users/sign-in',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser == null) {
      throw new BadRequestError('Invalid credentials')
    }

    const isPasswordMatch = await compare(existingUser.password, password)
    if (!isPasswordMatch) {
      throw new BadRequestError('Invalid credentials')
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY ?? ''
    )

    req.session = {
      jwt: userJwt
    }

    return res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
