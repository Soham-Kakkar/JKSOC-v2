import { Router } from 'express'
import { getProfile, upgradeToMaintainer, createOrganizer } from '../controllers/profile.controller'
import { authenticateJWT, requireRole } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticateJWT, getProfile)
router.post('/upgrade-maintainer', authenticateJWT, upgradeToMaintainer)

// create organizer (only callable by existing ORGANIZERs)
router.post('/create-organizer', authenticateJWT, requireRole('ORGANIZER'), createOrganizer)

export default router
