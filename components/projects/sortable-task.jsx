"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { KanbanTask } from "./kanban-task"

export function SortableTask({ id, task, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="sortable-task mb-4" {...attributes} {...listeners}>
      <KanbanTask id={id} task={task} onEdit={onEdit} isDragging={isDragging} />
    </div>
  )
}

