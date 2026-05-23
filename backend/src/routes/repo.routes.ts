import { Router } from 'express'
import { submitRepo, approveRepo, getPendingRepos, getApprovedRepos, rejectRepo } from '../controllers/repo.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getApprovedRepos)
router.post('/submit', authenticateJWT, submitRepo)
router.get('/pending', authenticateJWT, getPendingRepos)
router.post('/:id/approve', authenticateJWT, approveRepo)
router.post('/:id/reject', authenticateJWT, rejectRepo)

export default router
