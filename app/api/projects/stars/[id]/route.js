// /pages/api/projects/stars/[id]/route.js
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(req, { params }) {
  await dbConnect()

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params

    let project = await Project.findOne({ _id: id })

    if (project) {
      const isStarred = project.stars.includes(session.user.id)
      const update = isStarred
        ? { $pull: { stars: session.user.id } }
        : { $addToSet: { stars: session.user.id } }

      project = await Project.findOneAndUpdate({ _id: id }, update, {
        new: true,
      })

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, data: project })
    }

    return NextResponse.json(
      { success: false, error: 'Project not found' },
      { status: 404 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(req, { params }) {
  await dbConnect()

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params

    const project = await Project.findOneAndUpdate(
      { _id: id },
      {
        $pull: { stars: session.user.id },
      },
      { new: true }
    )

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
