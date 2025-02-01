import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import {Gig} from '@/models/gigModels'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request) {
  await dbConnect()

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const gigData = {
      ...body,
      userId: session.user.id,
    }

    const gig = await Gig.create(gigData)
    return NextResponse.json({ success: true, data: gig }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function GET() {
  await dbConnect()

  try {
    const session = await getServerSession(authOptions)

    const gigs = await Gig.find().populate('userId', 'name profilePicture')
    return NextResponse.json({ success: true, data: gigs })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}


