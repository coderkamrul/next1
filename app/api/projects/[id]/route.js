// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import dbConnect from '@/lib/mongodb'
// import Project from '@/models/Project'

// export async function GET(req, { params }) {
//   const session = await getServerSession()
//   if (!session) {
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//   }

//   await dbConnect()
//   const project = await Project.findOne({
//     _id: params.id,
//     userId: session.user.id,
//   })
//   if (!project) {
//     return NextResponse.json({ error: 'Project not found' }, { status: 404 })
//   }
//   return NextResponse.json(project)
// }

// export async function PUT(req, { params }) {
//   const session = await getServerSession()
//   if (!session) {
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//   }

//   await dbConnect()
//   const { title, description } = await req.json()
//   const project = await Project.findOneAndUpdate(
//     { _id: params.id, userId: session.user.id },
//     { title, description },
//     { new: true }
//   )
//   if (!project) {
//     return NextResponse.json({ error: 'Project not found' }, { status: 404 })
//   }
//   return NextResponse.json(project)
// }

// export async function DELETE(req, { params }) {
//   const session = await getServerSession()
//   if (!session) {
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//   }

//   await dbConnect()
//   const project = await Project.findOneAndDelete({
//     _id: params.id,
//     userId: session.user.id,
//   })
//   if (!project) {
//     return NextResponse.json({ error: 'Project not found' }, { status: 404 })
//   }
//   return NextResponse.json({ message: 'Project deleted successfully' })
// }
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(request, { params }) {
  await dbConnect()

  try {
    const project = await Project.findById(params.id)
    if (!project) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
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
    const project = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!project) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
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
    const deletedProject = await Project.deleteOne({ _id: params.id })
    if (!deletedProject) {
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
