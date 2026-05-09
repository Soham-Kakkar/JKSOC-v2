import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import * as userService from '../services/user.service'

export const getProfile = async (req: Request, res: Response) => {
  const user = req.user as any
  if (!user) return res.sendStatus(401)

  // reload fresh user
  const u = await userService.findUserById(user.id)
  res.json(u)
}

export const upgradeToMaintainer = async (req: Request, res: Response) => {
  const user = req.user as any
  if (!user) return res.sendStatus(401)

  // require institute verification as a safety gate
  if (!user.instituteVerified) {
    return res.status(403).json({ message: 'Institute email must be verified to upgrade to maintainer' })
  }

  try {
    const already = await userService.isUserMaintainer(user.id)
    if (already) return res.json({ message: 'Already a maintainer' })

    await userService.addRoleToUser(user.id, 'MAINTAINER')
    const updated = await userService.findUserById(user.id)
    res.json({ message: 'Upgraded to maintainer', user: updated })
  } catch (err: any) {
    console.error(err)
    if (/unique/i.test(err.message || '')) {
      return res.json({ message: 'Already a maintainer' })
    }
    res.status(500).json({ message: 'Failed to upgrade role' })
  }
}
