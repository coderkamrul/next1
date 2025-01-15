import { NextResponse } from 'next/server'
i
import dbConnect from '@/lib/mongodb'
import Components from '@/models/Components'

export async function GET(req) {
  await dbConnect()

  const components = await Components.find().populate('versions').lean()

  return NextResponse.json({ success: true, data: components })
}
