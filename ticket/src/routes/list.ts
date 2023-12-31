import express, { type Request, type Response } from 'express'

import { Ticket } from '@/models/ticket'

const router = express.Router()

router.get('/api/tickets/', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined })
  return res.status(200).send(tickets)
})

export { router as listTicketRouter }
