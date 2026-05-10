import rateLimit from "express-rate-limit"

const Limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 120, // max requests per window
  standardHeaders: true,
  legacyHeaders: false,
})

export default Limiter