import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Tasks } from "@/models/Task"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    // Find all tasks for this project
    const { id } = await params
    const tasks = await Tasks.find({ projectId: id })

    // Group tasks by status
    const board = {
      todo: tasks.filter((task) => task.status === "todo"),
      inProgress: tasks.filter((task) => task.status === "inProgress"),
      review: tasks.filter((task) => task.status === "review"),
      done: tasks.filter((task) => task.status === "done"),
    }

    return NextResponse.json(board)
  } catch (error) {
    console.error("Failed to fetch kanban board:", error)
    return NextResponse.json({ error: "Failed to fetch kanban board" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()

    // This endpoint expects a complete board with all tasks in their columns
    // We'll update the status of each task based on which column it's in

    const updatePromises = []

    // Process each column
    for (const [status, tasks] of Object.entries(data)) {
      // Skip if not an array
      if (!Array.isArray(tasks)) continue

      // Update each task in this column
      for (const task of tasks) {
        updatePromises.push(Tasks.findByIdAndUpdate(task._id || task.id, { status }, { new: true }))
      }
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    // Return the updated board
    const { id } = await params
    const updatedTasks = await Tasks.find({ projectId: id })

    const updatedBoard = {
      todo: updatedTasks.filter((task) => task.status === "todo"),
      inProgress: updatedTasks.filter((task) => task.status === "inProgress"),
      review: updatedTasks.filter((task) => task.status === "review"),
      done: updatedTasks.filter((task) => task.status === "done"),
    }

    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error("Failed to update kanban board:", error)
    return NextResponse.json({ error: "Failed to update kanban board" }, { status: 500 })
  }
}

