
"use client"

import { useDraggable } from "@dnd-kit/core"
import { Pencil, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

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
  const draggable = useDraggable({
    id: id,
    data: {
      task,
      column: task?.status || "todo",
    },
    disabled: !task,
  })

  const { attributes, listeners, setNodeRef, transform, isDragging } = useMemo(() => {
    return task
      ? draggable
      : {
          attributes: {},
          listeners: {},
          setNodeRef: () => {},
          transform: null,
          isDragging: false,
        }
  }, [task, draggable])

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.7 : 1,
        boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.1)" : undefined,
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${isDragging ? "dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <CardHeader className="p-4 pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base pr-8">{task?.title || "Untitled Task"}</CardTitle>
          <PriorityBadge priority={task?.priority} />
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
        <CardDescription className="line-clamp-2">{task?.description || "No description provided"}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Avatar className="h-6 w-6">
          <AvatarImage src={task?.assignee?.avatar || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{task?.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">{task?.assignee?.name || "Unassigned"}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              if (onEdit) onEdit()
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit task</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // FIXME: Delete task
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

