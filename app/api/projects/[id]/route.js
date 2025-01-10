import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(request, { params }) {
  const { id } = await params
  await dbConnect()

  try {
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function PUT(request, { params }) {
  await dbConnect()

  try {
    const body = await request.json()
    const project = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!project) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(request, { params }) {
  await dbConnect()

  try {
    const deletedProject = await Project.deleteOne({ _id: params.id })
    if (!deletedProject) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
