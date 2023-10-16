import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/api/users/current-user', async (req, res) => {
    if (!req.session?.jwt) {
        return res.send({ currentUser: null })
    }

    try {
        const payload = jwt.verify(
            req.session?.jwt,
            process.env.JWT_KEY!,
        )
        res.send({ currentUser: payload })
    } catch (error) {
        res.send({ currentUer: null })
    }
})

export { router as currentUserRouter }