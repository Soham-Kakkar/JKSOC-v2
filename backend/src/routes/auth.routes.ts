import { Router } from 'express'
import passport from '../lib/passport'
import { githubCallback, getMe } from '../controllers/auth.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

// Allow passing desired role via query param `role` (e.g. ?role=MAINTAINER)
router.get('/github', (req, res, next) => {
  const role = req.query.role as string | undefined
  const state = role ? role : undefined
  passport.authenticate('github', { scope: ['user:email'], state })(req, res, next)
})

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  githubCallback
)

router.get('/me', authenticateJWT, getMe)

export default router
