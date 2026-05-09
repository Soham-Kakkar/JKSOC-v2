import { Router } from 'express'
import { submitRepo, approveRepo } from '../controllers/repo.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

router.post('/submit', authenticateJWT, submitRepo)
router.post('/:id/approve', authenticateJWT, approveRepo)

export default router
