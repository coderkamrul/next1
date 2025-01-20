import { NextResponse } from 'next/server'
import Email from '@/models/Email'
import dbConnect from '@/lib/mongodb'
import { validateEmail } from '@/lib/utils'
import nodemailer from 'nodemailer'

// Create a transporter using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

export async function POST(request) {
  try {
    const { to, subject, message, submissionId } = await request.json()

    // Validate input
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!validateEmail(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Save email to database
    const email = new Email({
      to,
      from: process.env.GMAIL_USER,
      subject,
      text: message,
      html: `<p>${message}</p>`,
      submissionId,
    })

    await dbConnect()
    await email.save()

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    })

    return NextResponse.json({ success: true, data: email })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await dbConnect()
    const deletedEmails = await Email.deleteMany({})

    if (!deletedEmails) {
      return NextResponse.json({ error: 'No emails found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: deletedEmails })
  } catch (error) {
    console.error('Failed to delete all emails:', error)
    return NextResponse.json(
      { error: 'Failed to delete all emails' },
      { status: 500 }
    )
  }
}
