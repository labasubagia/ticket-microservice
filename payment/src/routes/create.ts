import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@klstickets/common'
import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'

import { paymentCreatedPublisher } from '@/events/publishers/payment-created-publisher'
import { Order } from '@/models/order'
import { Payment } from '@/models/payment'
import { stripe } from '@/stripe'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findOne({
      _id: orderId,
      userId: req?.currentUser?.id
    })

    if (order == null) {
      throw new NotFoundError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order')
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token
    })

    const payment = Payment.build({ orderId, stripeId: charge.id })
    await payment.save()

    await paymentCreatedPublisher.publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })

    res.send({ id: payment.id })
  }
)

export { router as createChargeRouter }
