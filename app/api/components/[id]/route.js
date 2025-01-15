import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Components from '@/models/Components'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { message: 'You must be signed in to access this route.' },
      { status: 401 }
    )
  }

  const { id } = params
  const component = await Components.findOne({
    _id: id,
    userId: session.user.id,
  })
    .populate('versions')
    .lean()

  if (!component) {
    return NextResponse.json(
      { message: 'Component not found or you do not have access.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: component })
}

export async function DELETE(req, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { message: 'You must be signed in to access this route.' },
      { status: 401 }
    )
  }

  const { id } = params
  const component = await Components.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  })

  if (!component) {
    return NextResponse.json(
      { message: 'Component not found or you do not have access.' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Component deleted successfully',
  })
}

export async function PUT(req, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { message: 'You must be signed in to access this route.' },
      { status: 401 }
    )
  }

  const { id } = params
  const data = await req.json()
  const component = await Components.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { ...data },
    { new: true }
  )

  if (!component) {
    return NextResponse.json(
      { message: 'Component not found or you do not have access.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: component })
}
