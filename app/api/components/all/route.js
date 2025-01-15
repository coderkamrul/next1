import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Components from '@/models/Components'
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

  const components = await Components.find().populate('versions').lean()

  return NextResponse.json({ success: true, data: components })
}
