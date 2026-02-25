import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { groupsRouter } from './routes/groups'
import { healthRouter } from './routes/health'
import { webhooksRouter } from './routes/webhooks'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/health', healthRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/webhooks', webhooksRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  })
})

// Error handling
app.use(errorHandler)

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // Backend server started
  })
}

export default app
