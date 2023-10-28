import { currentUser } from '@/middlewares/current-user'
import { requireAuth } from '@/middlewares/require-auth'
import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get(
  '/api/users/current-user',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser })
  }
)

export { router as currentUserRouter }
