import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { message: 'You must be signed in to access this route.' },
      { status: 401 }
    )
  }

  try {
    const blogs = await Blog.find({ userId: session.user.id })
      .populate('userId', 'name profilePicture')
      .lean()
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { message: 'You must be signed in to access this route.' },
      { status: 401 }
    )
  }

  try {
    const { title, tags, image, description, content } = await req.json()
    const blog = await Blog.create({
      title,
      description,
      content,
      userId: session.user.id,
      image,
      tags,
      author: {
        _id: session.user.id,
        name: session.user.name,
        profilePicture: session.user.profilePicture,
      },
      views: 0,
      likes: [],
      comments: [],
    })
    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
