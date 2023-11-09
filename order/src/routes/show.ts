import { NotFoundError, requireAuth } from '@klstickets/common'
import express, { type Request, type Response } from 'express'

import { Order } from '@/models/order'

const router = express.Router()

router.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.currentUser?.id
    }).populate('ticket')
    if (order == null) {
      throw new NotFoundError()
    }
    return res.status(200).send(order)
  }
)

export { router as showOrderRouter }
