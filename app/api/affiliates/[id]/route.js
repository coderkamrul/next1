import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Affiliate from '@/models/Affiliate'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req, { params }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = params
    const affiliate = await Affiliate.findOne({
      userId: session.user.id,
      _id: id,
    })
    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Affiliate not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: affiliate })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { id } = data
    const affiliate = await Affiliate.findOneAndUpdate(
      { userId: session.user.id, _id: id },
      data,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Affiliate not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: affiliate })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { id } = params
    const affiliate = await Affiliate.findOneAndDelete({
      userId: session.user.id,
      _id: id,
    })

    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Affiliate not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, message: 'Affiliate deleted' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
