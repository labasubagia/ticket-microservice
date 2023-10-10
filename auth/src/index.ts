import express from "express";
import { json } from "express";

const app = express()
app.use(json())

app.get('/api/users/current-user', (req, res) => {
    res.send('Hi there!')
})

app.listen(3000, () => {
    console.log('Listening to port 3000!')
})