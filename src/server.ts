import dotenv from 'dotenv'
import dns from 'node:dns'
import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config()

let server: Server

const port = Number(process.env.PORT)
const mongodbUri = process.env.MONGODB_URL
const databaseConnectionAttempts = 3
const databaseRetryDelayMs = 5000
const defaultDnsServers = ['1.1.1.1', '8.8.8.8']

const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

const isSrvLookupRefused = (error: unknown) =>
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'syscall' in error &&
    error.code === 'ECONNREFUSED' &&
    error.syscall === 'querySrv'

const useDnsFallback = () => {
    const configuredDnsServers = process.env.MONGODB_DNS_SERVERS
        ?.split(',')
        .map((server) => server.trim())
        .filter(Boolean)
    const dnsServers = configuredDnsServers?.length
        ? configuredDnsServers
        : defaultDnsServers

    dns.setServers(dnsServers)
    console.warn(`MongoDB SRV lookup failed. Retrying with DNS: ${dnsServers.join(', ')}`)
}

const connectToDatabase = async () => {
    if (!mongodbUri) {
        throw new Error('MONGODB_URL is missing from .env')
    }

    for (let attempt = 1; attempt <= databaseConnectionAttempts; attempt += 1) {
        try {
            await mongoose.connect(mongodbUri, {
                serverSelectionTimeoutMS: 5000,
            })
            return
        } catch (error) {
            if (attempt === databaseConnectionAttempts) {
                throw error
            }

            if (isSrvLookupRefused(error)) {
                useDnsFallback()
            }

            console.warn(
                `MongoDB connection attempt ${attempt}/${databaseConnectionAttempts} failed. Retrying in ${databaseRetryDelayMs / 1000}s...`,
            )
            await wait(databaseRetryDelayMs)
        }
    }
}

const startServer = async () => {
    try {
        await connectToDatabase()
        console.log('Successfully Connected to MongoDB')

        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error('MongoDB connection failed after multiple attempts:', error)
        process.exit(1)
    }
}

// unhandled Rejection handler
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

// SIGTERM handler
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

startServer()