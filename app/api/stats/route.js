import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Project } from "@/models/Projects"
import { Client } from "@/models/Client"

export async function GET() {
  try {
    await dbConnect()

    const projects = await Project.find({})
    const totalRevenue = projects.reduce((sum, project) => sum + project.budget, 0)
    const activeProjects = projects.filter((project) =>
      ["planning", "in-progress", "on-hold"].includes(project.status),
    ).length
    const completedProjects = projects.filter((project) => project.status === "completed").length
    const totalClients = await Client.countDocuments()

    const projectCompletionRate = projects.length > 0 ? (completedProjects / projects.length) : 0

    // Calculate growth rates and client satisfaction
    const revenueGrowth = projects.length > 0 ? totalRevenue / projects.length : 0
    const projectsGrowth = projects.length > 0 ? activeProjects / projects.length : 0
    const clientsGrowth = totalClients > 0 ? parseFloat(((totalClients - completedProjects) / totalClients).toFixed(2)) : 0
    const clientSatisfaction = Math.min(Math.floor((totalClients / completedProjects) * 5), 5)

    const revenueData = projects
      .map((project) => ({
        name: new Date(project.createdAt).toLocaleString("default", { month: "long" }),
        total: project.budget,
      }))
      .reduce((acc, curr) => {
        const existing = acc.find((item) => item.name === curr.name)
        if (existing) {
          existing.total += curr.total
        } else {
          acc.push(curr)
        }
        return acc
      }, [])
      .sort((a, b) => new Date(b.name) - new Date(a.name))

    const stats = {
      totalRevenue,
      revenueGrowth,
      activeProjects,
      projectsGrowth,
      totalClients,
      clientsGrowth,
      completedProjects,
      completedGrowth: projectCompletionRate * 100,
      projectCompletionRate: Math.round(projectCompletionRate * 100),
      clientSatisfaction,
      revenueData,
      reviewCount: 24, // Mock data
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

