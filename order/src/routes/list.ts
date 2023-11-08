import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get('/api/orders', async (req: Request, res: Response) => {
  return res.status(200).send({})
})

export { router as listOrderRouter }
