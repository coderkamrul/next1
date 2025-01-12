import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  await dbConnect()
  try {
    const reviews = await Review.find()
    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions)

  await dbConnect()
  try {
    const review = new Review({
      ...(await req.json()),
      clientId: session?.user?.id,
    })

    const savedReview = await review.save()
    return NextResponse.json(
      { success: true, data: savedReview },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
