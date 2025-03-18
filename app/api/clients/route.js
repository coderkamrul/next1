import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Client } from "@/models/Client"

export async function GET() {
  try {
    await dbConnect()
    const clients = await Client.find({}).sort({ createdAt: -1 })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const data = await request.json()

    const client = await Client.create(data)

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("Failed to create client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}

