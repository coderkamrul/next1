import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Project } from "@/models/Projects"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const project = await Project.findById(id).populate("client")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to fetch project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()

    // Extract client from the data to handle it properly
    const { client, ...projectData } = data

    // If client is provided and is an object with an id, use that id
    const updateData = { ...projectData }
    if (client) {
      updateData.client = client._id || client.id || client
    }

    const project = await Project.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("client")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const project = await Project.findByIdAndDelete(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

