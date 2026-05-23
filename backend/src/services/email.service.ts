import nodemailer from 'nodemailer'
import 'dotenv/config'

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS

const transporter =
  emailUser && emailPass
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      })
    : null

export const sendOtpEmail = async (email: string, otp: string) => {
  // Development-friendly fallback
  if (!transporter) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: OTP for ${email} is ${otp}`)
      return
    }

    throw new Error(
      'Email provider not configured (EMAIL_USER / EMAIL_PASS missing)'
    )
  }

  await transporter.sendMail({
    from: `"JKSoC" <${emailUser}>`,
    to: email,
    subject: 'Your JKSoC Verification Code',
    text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>JKSoC Verification</h2>

        <p>Your verification code is:</p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
          "
        >
          ${otp}
        </div>

        <p>This code will expire in 10 minutes.</p>

        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  })
}