import { currentUser, requireAuth } from '@klstickets/common'
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
