import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import User from '@/models/User' // Import the User model

export async function GET(req) {
  await dbConnect()

  try {
    const adminIds = await User.find({ role: 'admin' }).distinct('_id')
    const blogs = await Blog.find({
      'author._id': { $in: adminIds },
    })
      .populate('author', 'name profilePicture')
      .lean()
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
