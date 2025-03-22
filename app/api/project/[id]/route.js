// import { NextResponse } from "next/server"
// import dbConnect from "@/lib/mongodb"
// import { Project } from "@/models/Projects"

// export async function GET(request, { params }) {
//   try {
//     await dbConnect()
//     const { id } = await params
//     const project = await Project.findById(id).populate("client")

//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 })
//     }

//     return NextResponse.json(project)
//   } catch (error) {
//     console.error("Failed to fetch project:", error)
//     return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     await dbConnect()
//     const data = await request.json()

//     // Extract client from the data to handle it properly
//     const { client, ...projectData } = data

//     // If client is provided and is an object with an id, use that id
//     const updateData = { ...projectData }
//     if (client) {
//       updateData.client = client._id || client.id || client
//     }

//     const project = await Project.findByIdAndUpdate(params.id, updateData, {
//       new: true,
//       runValidators: true,
//     }).populate("client")

//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 })
//     }

//     return NextResponse.json(project)
//   } catch (error) {
//     console.error("Failed to update project:", error)
//     return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
//   }
// }

// export async function DELETE(request, { params }) {
//   try {
//     await dbConnect()
//     const project = await Project.findByIdAndDelete(params.id)

//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Failed to delete project:", error)
//     return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
//   }
// }



import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Project } from "@/models/Projects"
import { Tasks } from "@/models/Task" // Import the Tasks model

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params

    // Fetch the project
    const project = await Project.findById(id).populate("client")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Fetch all tasks for this project to calculate progress
    const tasks = await Tasks.find({ projectId: id })

    // Calculate task statistics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "done").length

    // Calculate progress percentage
    const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Update the project's progress field in memory
    // This doesn't save to the database but returns the updated value
    project.progress = calculatedProgress

    // If you want to also update the database with this value:
    await Project.findByIdAndUpdate(id, { progress: calculatedProgress })

    // Add task statistics to the response
    const projectResponse = project.toObject()
    projectResponse.taskStats = {
      total: totalTasks,
      completed: completedTasks,
      inProgress: tasks.filter((task) => task.status === "inProgress" || task.status === "review").length,
      pending: tasks.filter((task) => task.status === "todo").length,
    }

    return NextResponse.json(projectResponse)
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
    const { client, kanbanBoard, ...projectData } = data

    // If client is provided and is an object with an id, use that id
    const updateData = { ...projectData }
    if (client) {
      updateData.client = client._id || client.id || client
    }

    // If kanbanBoard is provided, update it and calculate progress
    if (kanbanBoard) {
      updateData.kanbanBoard = kanbanBoard

      // Calculate progress based on completed tasks
      let totalTasks = 0
      let completedTasks = 0

      // Count tasks in each column
      Object.keys(kanbanBoard).forEach((columnKey) => {
        const tasks = kanbanBoard[columnKey] || []
        totalTasks += tasks.length

        // Count completed tasks (those in the 'done' column)
        if (columnKey === "done") {
          completedTasks += tasks.length
        }
      })

      // Calculate progress percentage
      if (totalTasks > 0) {
        updateData.progress = Math.round((completedTasks / totalTasks) * 100)
      } else {
        updateData.progress = 0
      }
    } else {
      // If kanbanBoard is not provided but we need to update progress
      // Fetch all tasks for this project
      const tasks = await Tasks.find({ projectId: params.id })

      // Calculate task statistics
      const totalTasks = tasks.length
      const completedTasks = tasks.filter((task) => task.status === "done").length

      // Calculate progress percentage
      updateData.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
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

