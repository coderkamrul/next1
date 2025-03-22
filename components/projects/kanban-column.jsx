"use client"

import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function KanbanColumn({ id, title, children, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 ${isOver ? "bg-muted/50" : ""} rounded-lg p-4 border-2 ${isOver ? "border-primary/50" : "border-dashed border-muted-foreground/25"}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

