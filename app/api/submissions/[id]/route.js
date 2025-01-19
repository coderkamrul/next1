import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submissions'

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
    return NextResponse.json(
      { success: true, message: 'Submission deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
