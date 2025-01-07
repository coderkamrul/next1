import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()
    const project = await Project.create(body)
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function GET() {
  await dbConnect()

  try {
    const projects = await Project.find({})
    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
