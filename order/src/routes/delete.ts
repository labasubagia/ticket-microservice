import express, { type Request, type Response } from 'express'

const router = express.Router()

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  return res.status(200).send({ id })
})

export { router as deleteOrderRouter }
