// /pages/api/blog/[id]/comments.js

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req, { params }) {
  const { id } = params

  await dbConnect()
  const session = await getServerSession(authOptions)

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    const { comment } = await req.json()

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment is required.' },
        { status: 400 }
      )
    }

    const newComment = {
      author: {
        _id: session.user.id,
        name: session.user.name,
        profilePicture: session.user.profilePicture,
      },
      comment,
    }

    blog.comments.push(newComment)
    await blog.save()

    return NextResponse.json({ success: true, data: blog }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    )
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params
  console.log(id)

  await dbConnect()
  const session = await getServerSession(authOptions)

  try {
    // Find the comment in the blog and remove it
    const blog = await Blog.findOneAndUpdate(
      { 'comments._id': id },
      { $pull: { comments: { _id: id } } },
      { new: true }
    )

    if (!blog) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: blog },
      { message: 'Comment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting the comment', error: error.message },
      { status: 500 }
    )
  }
}
