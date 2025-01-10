// /pages/api/blog/[id]/views.js

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(request, { params }) {
  const { id } = await params

  await dbConnect()

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    // Increment view count only when the blog details are viewed
    blog.views += 1
    await blog.save() // Save the updated view count

    return NextResponse.json({ success: true, data: blog }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
