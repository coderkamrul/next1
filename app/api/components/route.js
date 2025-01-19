import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Components from '../../../models/Components.js'
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

  const components = await Components.find({ userId: session.user.id })
    .populate('versions')
    .lean()

  return NextResponse.json({ success: true, data: components })
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

  const data = await req.json()

  const component = await Components.create({
    ...data,
    userId: session.user.id,
  })

  return NextResponse.json(component, { status: 201 })
}
