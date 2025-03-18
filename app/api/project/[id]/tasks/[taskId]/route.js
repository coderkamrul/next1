import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Tasks } from "@/models/Task"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const task = await Tasks.findById(params.taskId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Failed to fetch task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()
    const { taskId } = await params
    const task = await Tasks.findByIdAndUpdate(taskId, data, {
      new: true,
      runValidators: true,
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Failed to update task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const task = await Tasks.findByIdAndDelete(params.taskId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}

