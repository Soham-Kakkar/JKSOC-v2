import { Resend } from 'resend'
import 'dotenv/config'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export const sendOtpEmail = async (email: string, otp: string) => {
  // Development friendly fallback: log OTP when API key is not configured
  if (!resend) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: OTP for ${email} is ${otp}`)
      return
    }
    throw new Error('Email provider not configured (RESEND_API_KEY missing)')
  }

  await resend.emails.send({
    from: 'JKSoC <no-reply@jksoc.in>',
    to: email,
    subject: 'Your JKSoC Verification Code',
    text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`,
  })
}
