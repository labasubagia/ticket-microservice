import express from "express";
import { json } from "express";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signUpRouter } from "./routes/sign-up";
import { signOutRouter } from "./routes/sign-out";
import { errorHandler } from "./middlewares/error-handler";

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.use(errorHandler)

app.listen(3000, () => {
    console.log('listening to port 3000!')
})