import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { sendOtpEmail } from '../services/email.service'
import crypto from 'crypto'

export const submitInstituteEmail = async (req: Request, res: Response) => {
  const { email, institute } = req.body
  const userId = (req.user as any).id

  if (!email || !institute) {
    return res.status(400).json({ message: 'Email and institute are required' })
  }

  // Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 999999).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  try {
    // Save OTP
    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        expiresAt,
      },
    })

    // Update user pending institute info
    await prisma.user.update({
      where: { id: userId },
      data: {
        institute,
        instituteEmail: email,
        instituteVerified: false,
      },
    })

    await sendOtpEmail(email, otpCode)

    res.json({ message: 'OTP sent to your institute email' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to process request' })
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body
  const userId = (req.user as any).id

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' })
  }

  try {
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: userId },
      data: {
        instituteVerified: true,
      },
    })

    // Delete OTP after use
    await prisma.otp.delete({
      where: { id: otp.id },
    })

    res.json({ message: 'Institute email verified successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to verify OTP' })
  }
}
