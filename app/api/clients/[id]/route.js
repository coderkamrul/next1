import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Client } from "@/models/Client"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const client = await Client.findById(params.id)

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("Failed to fetch client:", error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()

    const client = await Client.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("Failed to update client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const client = await Client.findByIdAndDelete(params.id)

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}

