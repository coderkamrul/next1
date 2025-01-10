// /pages/api/blog/[id]/likes.js

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

    const index = blog.likes.indexOf(session.user.id)

    if (index === -1) {
      // Add like to blog
      blog.likes.push(session.user.id)
    } else {
      // Remove like from blog
      blog.likes.splice(index, 1)
    }

    await blog.save()

    return NextResponse.json(
      { success: true, likes: blog.likes.length },
      { status: 200 }
    )
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
  const { id } = params

  await dbConnect()
  const session = await getServerSession(authOptions)

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    const index = blog.likes.indexOf(session.user.id)
    if (index === -1) {
      return NextResponse.json(
        {
          message: 'User has not liked this blog.',
        },
        { status: 400 }
      )
    }

    // Remove like from blog
    blog.likes.splice(index, 1)
    await blog.save()

    return NextResponse.json(
      { success: true, likes: blog.likes.length },
      { status: 200 }
    )
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
