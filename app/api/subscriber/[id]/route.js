import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function GET(request, { params }) {
  const { id } = await params
  await dbConnect()

  try {
    const subscriber = await Subscriber.findById(id)
    if (!subscriber) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: subscriber })
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
    const subscriber = await Subscriber.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!subscriber) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: subscriber })
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
    const deletedSubscriber = await Subscriber.deleteOne({ _id: params.id })
    if (!deletedSubscriber) {
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

