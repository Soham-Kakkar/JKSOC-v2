import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import * as userService from '../services/user.service'
import 'dotenv/config'

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = await userService.findUserById(decoded.id)

      if (!user) {
        return res.sendStatus(403)
      }

      req.user = user
      next()
    } catch (err) {
      return res.sendStatus(403)
    }
  } else {
    res.sendStatus(401)
  }
}

export const requireRole = (roleName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user) return res.sendStatus(401)

    const has = (user.roles || []).some((r: any) => r.role?.name === roleName)
    if (!has) return res.status(403).json({ message: `Requires ${roleName} role` })

    next()
  }
}
