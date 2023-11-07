import { requireAuth, validateRequest } from '@klstickets/common'
import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'

import { TicketCreatedPublisher } from '@/events/publishers/ticket-created-publisher'
import { Ticket } from '@/models/ticket'
import { natsWrapper } from '@/nats-wrapper'

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is invalid'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is invalid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = Ticket.build({ title, price, userId: req.currentUser.id })
    await ticket.save()

    const publisher = await new TicketCreatedPublisher(
      natsWrapper.client
    ).init()
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })
    return res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
