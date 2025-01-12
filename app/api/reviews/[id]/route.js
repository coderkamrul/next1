import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'

// Get review by ID
export async function GET(req, { params }) {
  await dbConnect()
  try {
    const review = await Review.findById(params.id)
    if (!review) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// Update review by ID
export async function PATCH(req, { params }) {
  await dbConnect()
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      await req.json(),
      { new: true }
    )
    if (!updatedReview) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updatedReview })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// Delete review by ID
export async function DELETE(req, { params }) {
  await dbConnect()
  try {
    const deletedReview = await Review.findByIdAndDelete(params.id)
    if (!deletedReview) {
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
