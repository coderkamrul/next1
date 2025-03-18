"use client"

import { Pencil } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Priority badge component
function PriorityBadge({ priority }) {
  const priorityMap = {
    low: { label: "Low", variant: "outline" },
    medium: { label: "Medium", variant: "secondary" },
    high: { label: "High", variant: "destructive" },
  }

  const { label, variant } = priorityMap[priority] || { label: priority || "Unknown", variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

export function KanbanTask({ id, task, onEdit }) {
  // Add null check to prevent the error
  if (!task) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Task data unavailable</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card
      className="shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
      draggable="true"
    >
      <CardHeader className="p-4 pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base pr-8">{task.title || "Untitled Task"}</CardTitle>
          <PriorityBadge priority={task.priority} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            if (onEdit) onEdit()
          }}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit task</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <CardDescription className="line-clamp-2">{task.description || "No description provided"}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Avatar className="h-6 w-6">
          <AvatarImage src={task.assignee?.avatar || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">{task.assignee?.name || "Unassigned"}</span>
      </CardFooter>
    </Card>
  )
}

