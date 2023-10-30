import { NotFoundError, requireAuth, validateRequest } from '@klstickets/common'
import express, { type Request, type Response } from 'express'
import { body, param } from 'express-validator'

import { Ticket } from '@/models/ticket'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    param('id').trim().notEmpty().withMessage('Id is required'),
    body('title').trim().notEmpty().withMessage('Title is invalid'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is invalid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const ticket = await Ticket.findOne({
      _id: id,
      userId: req.currentUser?.id
    })
    if (ticket == null) {
      throw new NotFoundError()
    }

    const { title, price } = req.body
    ticket.set({ title, price })
    await ticket.save()

    return res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
