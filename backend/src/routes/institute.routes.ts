import { Router } from 'express'
import { submitInstituteEmail, verifyOtp } from '../controllers/institute.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

router.post('/submit', authenticateJWT, submitInstituteEmail)
router.post('/verify', authenticateJWT, verifyOtp)

export default router
