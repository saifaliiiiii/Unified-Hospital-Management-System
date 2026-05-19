import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import chatRoutes from './routes/chat.js'
import { hasUsableGeminiKey } from './services/geminiService.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = (
  process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      const error = new Error(`CORS blocked origin: ${origin}`)
      error.statusCode = 403
      error.code = 'CORS_BLOCKED'
      callback(error)
    },
  }),
)
app.use(express.json({ limit: '32kb' }))

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/chat', chatRoutes)

app.use((error, _req, res, _next) => {
  console.error('Server error:', error)

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      code: 'INVALID_JSON',
      error: 'Invalid JSON request body.',
    })
  }

  if (error.code === 'CORS_BLOCKED') {
    return res.status(403).json({
      code: 'CORS_BLOCKED',
      error: 'This frontend origin is not allowed to call the chat API.',
      allowedOrigins,
    })
  }

  return res.status(error.statusCode || 500).json({
    code: error.code || 'SERVER_ERROR',
    error: error.publicMessage || 'Unexpected server error.',
  })
})

app.listen(port, () => {
  console.log(`AI medical assistant API listening on port ${port}`)
  console.log('GEMINI API KEY CONFIGURED:', hasUsableGeminiKey())
})
