import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'

export async function GET(request, { params }) {
  const { id } = await params
  await dbConnect()

  try {
    const video = await Course.findById(id)
    if (!video) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: video })
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
    const video = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!video) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: video })
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
    const deletedVideo = await Course.deleteOne({ _id: params.id })
    if (!deletedVideo) {
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
