import express, { type Request, type Response } from 'express'
import router from './app/modules/routes/index.js';

const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to, Tech  Basket API' })
})

// API routes
app.use("/api/v1", router);

export default app