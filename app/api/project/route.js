import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Project } from "@/models/Projects"
import { Client } from "@/models/Client"

export async function GET() {
  try {
    await dbConnect()
    const projects = await Project.find({}).populate("client").sort({ createdAt: -1 })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const data = await request.json()

    // Extract client from the data to handle it properly
    const { clientId, ...projectData } = data

  

    const project = await Project.create({
      ...projectData,
      client: clientId,
    })

    // Populate the client data for the response
    const populatedProject = await Project.findById(project._id).populate("client")

    return NextResponse.json(populatedProject, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

