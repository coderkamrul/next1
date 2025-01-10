import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Youtube from '@/models/Youtube'

export async function GET() {
  await dbConnect()

  try {
    const youtubeVideos = await Youtube.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: youtubeVideos })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
