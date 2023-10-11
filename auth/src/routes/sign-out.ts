import express from 'express'

const router = express.Router()

router.post('/api/users/sign-out', (req, res) => {
    res.send('Hi there!')
})

export { router as signOutRouter }