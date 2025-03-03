import connectDB from "./DB/connection.js"
import { globalErrorHandling } from "./utils/Response/Error/error.handling.js"
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import companyController from './modules/company/company.controller.js'
import chatController from './modules/chat/chat.controller.js'
import cors from 'cors'
import helmet from "helmet"
import { rateLimit } from 'express-rate-limit'
import { createHandler } from "graphql-http/lib/use/express"
import { schema } from "./modules/app.graphql.js"

const bootstrap = (app, express) => {

    app.use(helmet()) //Help secure Express apps by setting HTTP response headers
    app.use(cors()) //Enable All CORS Requests

    const Limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
    })

    app.use(Limiter) // to limit repeated requests

    app.use(express.json()) //converting buffer data

    //app sub-routing
    app.use('/auth', authController)
    app.use('/user', userController)
    app.use('/company', companyController)
    app.use('/chat', chatController)
    app.use('/graphql', createHandler({ schema: schema }))

    //app routing
    app.get('/', (req, res) => {
        return res.json({ message: `Welcome to ${process.env.APP_NAME}` })
    })
    app.all('*', (req, res) => res.send('In-valid routing'))

    //DB Connection 
    connectDB()

    //global error handling
    app.use(globalErrorHandling)
}

export default bootstrap