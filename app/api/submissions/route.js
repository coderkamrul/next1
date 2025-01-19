import { NextResponse } from 'next/server'
import Submission from '@/models/Submissions'
import dbConnect from '@/lib/mongodb'

export async function POST(req) {
  await dbConnect()

  try {
    const submission = new Submission(await req.json())

    const savedSubmission = await submission.save()

    return NextResponse.json(
      { success: true, data: savedSubmission },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function GET(req) {
  try {
    const submissions = await Submission.find()

    return NextResponse.json(
      { success: true, data: submissions },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
