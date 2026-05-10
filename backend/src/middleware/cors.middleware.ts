import cors from 'cors'
import 'dotenv/config'

const frontendUri = process.env.FRONTEND_URL

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true)

    try {
      const requestHost = new URL(origin).hostname

      // localhost fallback if FRONTEND_URL not defined
      if (!frontendUri) {
        return requestHost === 'localhost'
          ? callback(null, true)
          : callback(new Error('CORS blocked'))
      }

      const frontendHost = new URL(frontendUri).hostname

      const isAllowed =
        requestHost === frontendHost || requestHost.endsWith(`.${frontendHost}`)

      return isAllowed
        ? callback(null, true)
        : callback(new Error(`CORS blocked for origin: ${origin}`))

    } catch {
      return callback(new Error('Invalid origin'))
    }
  },
  credentials: true,
}

export default cors(corsOptions)