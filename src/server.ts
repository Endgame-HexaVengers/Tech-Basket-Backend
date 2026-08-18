import dotenv from 'dotenv'

import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app.js'


dotenv.config()

let server: Server
const port = Number(process.env.PORT) || 5000

const mongodbUri = process.env.MONGODB_URL as string

const startServer = async () => {
    try {
        await mongoose.connect(mongodbUri)
        console.log('Connected to MongoDB')

        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()

// unhandled Rejection  handler
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason)
    if (server) {
        server.close(() => {
            process.exit(1)
        })

    } else {
        process.exit(1)
    }
})

// uncaughtException handler
process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
})

// Sigterm handler
process.on('SIGTERM', () => {
    console.log('SIGTERM received')
    if (server) {
        server.close(() => {
            process.exit(0)
        })
    } else {
        process.exit(0)
    }
})      
