import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Youtube from '@/models/Youtube'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  await dbConnect()
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    const youtubeVideos = await Youtube.find({ userId: session.user.id }).sort({
      createdAt: -1,
    })
    return NextResponse.json({ success: true, data: youtubeVideos })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function POST(req) {
  await dbConnect()
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }
    const body = await req.json()
    const youtubeVideo = new Youtube({ ...body, userId: session.user.id })
    await youtubeVideo.save()
    return NextResponse.json(youtubeVideo, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}
