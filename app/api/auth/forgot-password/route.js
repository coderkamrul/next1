import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

export async function POST(req) {
  try {
    await dbConnect()
    const { email } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetPasswordOTP = otp
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    await sendEmail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    })

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
