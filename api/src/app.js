import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

dotenv.config({
    path: "../.env"
})

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        optionsSuccessStatus: 200,
        credentials: true
    })
)

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(cookieParser())


//import routes

import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import eventRouter from "./routes/event.routes.js"
import teamRouter from "./routes/team.routes.js"
import formRouter from "./routes/form.routes.js"
import participationRouter from "./routes/participation.routes.js"

//routes

app.use("/api/v1/healthcheck", healthcheckRouter)

app.use("/api/v1/users", userRouter)

app.use("/api/v1/events", eventRouter)

app.use("/api/v1/teams", teamRouter)

app.use("/api/v1/forms", formRouter)

app.use("/api/v1/participation", participationRouter)

export { app }