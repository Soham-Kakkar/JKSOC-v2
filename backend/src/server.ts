import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import passport from './lib/passport'
import authRoutes from './routes/auth.routes'
import instituteRoutes from './routes/institute.routes'

// BigInt JSON serialization fix
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

const app = express()
const PORT = process.env.PORT || 5000


app.use(cors())
app.use(express.json())
app.use(passport.initialize())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/institute', instituteRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
