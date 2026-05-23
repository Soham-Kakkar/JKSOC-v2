import { Router } from 'express'
import { submitRepo, approveRepo, getPendingRepos, getApprovedRepos, rejectRepo } from '../controllers/repo.controller'
import { authenticateJWT, requireRole } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getApprovedRepos)
router.post('/submit', authenticateJWT, requireRole('MAINTAINER'), submitRepo)
router.get('/pending', authenticateJWT, requireRole('ORGANIZER'), getPendingRepos)
router.post('/:id/approve', authenticateJWT, requireRole('ORGANIZER'), approveRepo)
router.post('/:id/reject', authenticateJWT, requireRole('ORGANIZER'), rejectRepo)

export default router
