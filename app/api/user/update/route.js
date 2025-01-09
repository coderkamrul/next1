import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function PUT(req) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    console.log(session)

    await dbConnect()
    const { name, email, profilePicture } = await req.json()

    console.log('Updating user:', { name, email, profilePicture })

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, email, profilePicture },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
