import { NotFoundError, validateRequest } from '@klstickets/common'
import express, { type Request, type Response } from 'express'
import { param } from 'express-validator'

import { Ticket } from '@/models/ticket'

const router = express.Router()

router.get(
  '/api/tickets/:id',
  [param('id').trim().notEmpty().withMessage('Id is invalid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const ticket = await Ticket.findOne({ _id: id })
    if (ticket == null) {
      throw new NotFoundError()
    }
    return res.status(200).send(ticket)
  }
)

export { router as showTicketRouter }
