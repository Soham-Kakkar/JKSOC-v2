import { Router } from 'express'
import passport from '../lib/passport'
import { githubCallback, getMe } from '../controllers/auth.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  githubCallback
)

router.get('/me', authenticateJWT, getMe)

export default router
