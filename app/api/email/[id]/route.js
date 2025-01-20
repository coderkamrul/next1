import { NextResponse } from 'next/server'
import Email from '@/models/Email'
import dbConnect from '@/lib/mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()
    const emails = await Email.find({ submissionId: id }).sort({
      createdAt: -1,
    })

    return NextResponse.json(emails)
  } catch (error) {
    console.error('Failed to get emails:', error)
    return NextResponse.json({ error: 'Failed to get emails' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()
    const deletedEmail = await Email.findByIdAndDelete(id)

    if (!deletedEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: deletedEmail })
  } catch (error) {
    console.error('Failed to delete email:', error)
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    )
  }
}
