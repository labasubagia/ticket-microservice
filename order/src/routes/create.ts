import {
  BadRequestError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@klstickets/common'
import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { Order } from '@/models/order'
import { Ticket } from '@/models/ticket'

const router = express.Router()

const EXPIRATION_WINDOW_MINUTES = 15

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId invalid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)
    if (ticket == null) {
      throw new BadRequestError('Ticket is does not exists')
    }
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    const expiration = new Date()
    expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_MINUTES)

    const order = Order.build({
      userId: req.currentUser?.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save()

    return res.status(201).send(order)
  }
)

export { router as createOrderRouter }
