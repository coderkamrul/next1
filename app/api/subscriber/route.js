import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();

  try {
    const subscribers = await Subscriber.find()
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'You must be signed in to access this route.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const newSubscriber = new Subscriber({ ...body, userId: session.user.id });
    await newSubscriber.save();
    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE() {
  await dbConnect();

  try {
    await Subscriber.deleteMany({});
    return NextResponse.json({ success: true, message: 'All subscribers deleted successfully.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

