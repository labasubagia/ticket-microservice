import { NotFoundError, requireAuth } from '@klstickets/common'
import express, { type Request, type Response } from 'express'

import { orderCancelledPublisher } from '@/events/publishers/order-cancelled-publisher'
import { Order, OrderStatus } from '@/models/order'

const router = express.Router()

router.delete(
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
    order.status = OrderStatus.Cancelled
    await order.save()

    // publish event
    await orderCancelledPublisher.publish({
      id: order.id,
      ticket: { id: order?.ticket?.id },
      version: order.version
    })

    return res.status(204).send()
  }
)

export { router as deleteOrderRouter }
