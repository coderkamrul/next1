import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET() {
  await dbConnect()

  try {
    const blogs = await Blog.find({})
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
