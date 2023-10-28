import express, { type Request, type Response } from 'express'

const router = express.Router()

router.post('/api/users/sign-out', async (req: Request, res: Response) => {
  req.session = null
  return res.send({})
})

export { router as signOutRouter }
