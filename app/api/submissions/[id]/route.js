import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submissions'
import Email from '@/models/Email'


export async function DELETE(req, { params }) {
  try {
    await dbConnect()
    const submission = await Submission.findByIdAndDelete(params.id)
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      )
    }

    await Email.deleteMany({ submissionId: params.id })

    return NextResponse.json(
      { success: true, message: 'Submission deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
export async function PUT(req, { params }) {
  try {
    await dbConnect()
    const body = await req.json()
    const submission = await Submission.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Submission updated successfully', data: submission },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

