import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const githubCallback = (req: Request, res: Response) => {
  const user = req.user as any

  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`)
  }

  const token = jwt.sign(
    { id: user.id, githubId: user.githubId.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
}

export const getMe = (req: Request, res: Response) => {
  res.json(req.user)
}
