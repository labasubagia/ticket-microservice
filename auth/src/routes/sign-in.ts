import express from 'express'

const router = express.Router()

router.post('/api/users/sign-in', async (req, res) => {
    res.send('Hi there!')
})

export { router as signInRouter }