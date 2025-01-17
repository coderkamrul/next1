import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Affiliate from '@/models/Affiliate'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Create a new affiliate
export async function POST(req) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be signed in to access this route.',
        },
        { status: 401 }
      )
    }

    const data = await req.json()
    const affiliate = await Affiliate.create({
      ...data,
      userId: session.user.id,
    })
    return NextResponse.json(
      { success: true, data: affiliate },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Read affiliate details
export async function GET(req) {
  try {
    await dbConnect()
    const affiliates = await Affiliate.find().populate(
      'userId',
      'name profilePicture'
    )
    return NextResponse.json(
      { success: true, data: affiliates },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
