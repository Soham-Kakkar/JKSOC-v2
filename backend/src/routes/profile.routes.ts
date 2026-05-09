import { Router } from 'express'
import { getProfile, upgradeToMaintainer } from '../controllers/profile.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticateJWT, getProfile)
router.post('/upgrade-maintainer', authenticateJWT, upgradeToMaintainer)

export default router
