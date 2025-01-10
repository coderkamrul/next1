import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Define a schema for input validation
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  profilePicture: z.string().url().optional(),
})

export async function PUT(req) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to the database
    await dbConnect()

    // Parse and validate the request body
    const body = await req.json()
    const result = updateUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, profilePicture } = result.data

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name, email, profilePicture } },
      { new: true, runValidators: true, select: 'name email profilePicture' }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update the session
    session.user.name = updatedUser.name
    session.user.email = updatedUser.email
    session.user.profilePicture = updatedUser.profilePicture

    // Return the updated user data
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
