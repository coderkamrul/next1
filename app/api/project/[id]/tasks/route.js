import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Tasks } from "@/models/Task"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const tasks = await Tasks.find({ projectId: params.id })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()

    const task = await Tasks.create({
      ...data,
      projectId: params.id,
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Failed to create task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

