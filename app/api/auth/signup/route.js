import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateUsername } from '@/lib/utils'

export async function POST(req) {
  try {
    await dbConnect()
    const { name, email, password, profilePicture } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      // If user already exists, return an error
      return NextResponse.json(
        { error: 'You already have an account. Please sign in.' },
        { status: 400 }
      )
    }

    // Generate unique username
    const username = await generateUsername(name)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      profilePicture,
    })

    await newUser.save()

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
