import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Gig } from "@/models/gigModels";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET gig by ID
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params;
  try {
    const gig = await Gig.findById(id).lean().populate('userId', 'name profilePicture')
    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: gig });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT (edit) gig by ID
export async function PUT(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to access this route." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const updatedData = await req.json();

  try {
    const gig = await Gig.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).lean();
    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: gig });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE gig by ID
export async function DELETE(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You must be signed in to access this route." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const gig = await Gig.findById(id).lean();

    console.log(gig);
    await Gig.findOneAndDelete({ _id: id });
    return NextResponse.json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
