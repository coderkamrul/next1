// "use client"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"
// import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react"
// import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
// import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
// import { getKanbanBoard, updateKanbanBoard, createTask, updateTask, deleteTask, getProject } from "@/lib/api"
// import { KanbanTask } from "@/components/projects/kanban-task"

// export default function KanbanBoard({ params }) {
//   const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] })
//   const [columns, setColumns] = useState([
//     { id: "todo", title: "To Do" },
//     { id: "inProgress", title: "In Progress" },
//     { id: "review", title: "Review" },
//     { id: "done", title: "Done" },
//   ])
//   const [projectTitle, setProjectTitle] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     priority: "medium",
//     assignee: {
//       name: "Unassigned",
//       avatar: "",
//     },
//   })
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false)
//   const [newColumnTitle, setNewColumnTitle] = useState("")
//   const [currentColumn, setCurrentColumn] = useState("todo")
//   const [editingTask, setEditingTask] = useState(null)
//   const [activeId, setActiveId] = useState(null)
//   const [activeTask, setActiveTask] = useState(null)
//   const [draggedTask, setDraggedTask] = useState(null)
//   const { toast } = useToast()

//   // Refs for columns to apply animation
//   const todoColumnRef = useRef(null)
//   const inProgressColumnRef = useRef(null)
//   const reviewColumnRef = useRef(null)
//   const doneColumnRef = useRef(null)

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8,
//       },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     }),
//   )

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [boardData, projectData] = await Promise.all([getKanbanBoard(params.id), getProject(params.id)])

//         setTasks(boardData)
//         if (projectData) {
//           setProjectTitle(projectData.title)
//         }

//         // Update columns based on board data
//         const existingColumns = Object.keys(boardData).map((id) => ({
//           id,
//           title:
//             id === "todo"
//               ? "To Do"
//               : id === "inProgress"
//                 ? "In Progress"
//                 : id === "review"
//                   ? "Review"
//                   : id === "done"
//                     ? "Done"
//                     : id.charAt(0).toUpperCase() + id.slice(1),
//         }))

//         if (existingColumns.length > 0) {
//           setColumns(existingColumns)
//         }
//       } catch (error) {
//         console.error("Failed to fetch kanban data:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load kanban board. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [params.id, toast])

//   const handleAddTask = async () => {
//     if (!newTask.title.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Task title is required",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       const createdTask = await createTask(params.id, currentColumn, {
//         title: newTask.title,
//         description: newTask.description,
//         priority: newTask.priority,
//         assignee: newTask.assignee,
//       })

//       setTasks((prev) => ({
//         ...prev,
//         [currentColumn]: [...prev[currentColumn], createdTask],
//       }))

//       toast({
//         title: "Task created",
//         description: "New task has been added to the board",
//       })

//       setNewTask({
//         title: "",
//         description: "",
//         priority: "medium",
//         assignee: {
//           name: "Unassigned",
//           avatar: "",
//         },
//       })

//       setIsDialogOpen(false)
//     } catch (error) {
//       console.error("Failed to create task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to create task. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEditTask = async () => {
//     if (!editingTask) return

//     const { _id, column } = editingTask

//     try {
//       const updatedTask = await updateTask(params.id, _id, {
//         title: editingTask.title,
//         description: editingTask.description,
//         priority: editingTask.priority,
//       })

//       if (updatedTask) {
//         setTasks((prev) => {
//           const columnTasks = [...prev[column]]
//           const taskIndex = columnTasks.findIndex((task) => task._id === _id)

//           if (taskIndex !== -1) {
//             columnTasks[taskIndex] = updatedTask
//           }

//           return {
//             ...prev,
//             [column]: columnTasks,
//           }
//         })

//         toast({
//           title: "Task updated",
//           description: "Task has been successfully updated",
//         })
//       }
//     } catch (error) {
//       console.error("Failed to update task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update task. Please try again.",
//         variant: "destructive",
//       })
//     }

//     setIsEditDialogOpen(false)
//     setEditingTask(null)
//   }

//   const handleDeleteTask = async () => {
//     if (!editingTask) return

//     const { _id, column } = editingTask

//     try {
//       const success = await deleteTask(params.id, _id)

//       if (success) {
//         setTasks((prev) => {
//           const columnTasks = [...prev[column]]
//           const filteredTasks = columnTasks.filter((task) => task._id !== _id)

//           return {
//             ...prev,
//             [column]: filteredTasks,
//           }
//         })

//         toast({
//           title: "Task deleted",
//           description: "Task has been successfully removed from the board",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to delete task. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Failed to delete task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete task. Please try again.",
//         variant: "destructive",
//       })
//     }

//     setIsEditDialogOpen(false)
//     setEditingTask(null)
//   }

//   const handleDuplicateTask = async () => {
//     if (!editingTask) return

//     const { column } = editingTask

//     try {
//       const duplicatedTask = await createTask(params.id, column, {
//         title: `${editingTask.title} (Copy)`,
//         description: editingTask.description,
//         priority: editingTask.priority,
//         assignee: editingTask.assignee,
//       })

//       setTasks((prev) => ({
//         ...prev,
//         [column]: [...prev[column], duplicatedTask],
//       }))

//       toast({
//         title: "Task duplicated",
//         description: "Task has been successfully duplicated",
//       })
//     } catch (error) {
//       console.error("Failed to duplicate task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to duplicate task. Please try again.",
//         variant: "destructive",
//       })
//     }

//     setIsEditDialogOpen(false)
//     setEditingTask(null)
//   }

//   const openAddTaskDialog = (column) => {
//     setCurrentColumn(column)
//     setIsDialogOpen(true)
//   }

//   const openEditTaskDialog = (task, column) => {
//     setEditingTask({ ...task, column })
//     setIsEditDialogOpen(true)
//   }

//   const handleAddColumn = async () => {
//     if (!newColumnTitle.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Column title is required",
//         variant: "destructive",
//       })
//       return
//     }

//     // Create a valid ID from the title (lowercase, no spaces)
//     const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, "")

//     // Check if column with this ID already exists
//     if (columns.some((col) => col.id === columnId)) {
//       toast({
//         title: "Validation Error",
//         description: "A column with a similar name already exists",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       // Add new column to state
//       const updatedColumns = [...columns, { id: columnId, title: newColumnTitle }]
//       setColumns(updatedColumns)

//       // Add new empty column to tasks
//       const updatedTasks = {
//         ...tasks,
//         [columnId]: [],
//       }
//       setTasks(updatedTasks)

//       // Update the board on the server
//       await updateKanbanBoard(params.id, updatedTasks)

//       toast({
//         title: "Column added",
//         description: "New column has been added to the board",
//       })

//       setNewColumnTitle("")
//       setIsNewColumnDialogOpen(false)
//     } catch (error) {
//       console.error("Failed to add column:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add column. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleRenameColumn = async (columnId, newTitle) => {
//     try {
//       const updatedColumns = columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col))
//       setColumns(updatedColumns)

//       toast({
//         title: "Column renamed",
//         description: "Column has been successfully renamed",
//       })
//     } catch (error) {
//       console.error("Failed to rename column:", error)
//       toast({
//         title: "Error",
//         description: "Failed to rename column. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteColumn = async (columnId) => {
//     // Don't allow deleting the default columns
//     if (["todo", "inProgress", "review", "done"].includes(columnId)) {
//       toast({
//         title: "Cannot delete",
//         description: "Default columns cannot be deleted",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       // Remove column from state
//       const updatedColumns = columns.filter((col) => col.id !== columnId)
//       setColumns(updatedColumns)

//       // Remove column from tasks
//       const { [columnId]: removedColumn, ...updatedTasks } = tasks
//       setTasks(updatedTasks)

//       // Update the board on the server
//       await updateKanbanBoard(params.id, updatedTasks)

//       toast({
//         title: "Column deleted",
//         description: "Column has been successfully removed from the board",
//       })
//     } catch (error) {
//       console.error("Failed to delete column:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete column. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDragStart = (e, task, sourceColumn) => {
//     setDraggedTask({ task, sourceColumn })
//     e.dataTransfer.setData("text/plain", task._id)

//     // For better drag preview
//     if (e.dataTransfer.setDragImage && e.currentTarget instanceof HTMLElement) {
//       e.dataTransfer.setDragImage(e.currentTarget, 20, 20)
//     }

//     // Add dragging class for visual feedback
//     e.currentTarget.classList.add("dragging")
//   }

//   const handleDragEnd = (e) => {
//     // Remove dragging class
//     e.currentTarget.classList.remove("dragging")

//     // Remove any placeholder elements
//     document.querySelectorAll(".task-placeholder").forEach((el) => el.remove())

//     // Reset any shifted elements
//     document.querySelectorAll(".shift-up, .shift-down").forEach((el) => {
//       el.classList.remove("shift-up", "shift-down")
//     })
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     if (e.currentTarget instanceof HTMLElement) {
//       e.currentTarget.classList.add("bg-muted/50", "border-primary/50")
//     }
//   }

//   const handleDragLeave = (e) => {
//     if (e.currentTarget instanceof HTMLElement) {
//       e.currentTarget.classList.remove("bg-muted/50", "border-primary/50")
//     }
//   }

//   const handleDrop = async (e, targetColumn) => {
//     e.preventDefault()

//     if (e.currentTarget instanceof HTMLElement) {
//       e.currentTarget.classList.remove("bg-muted/50", "border-primary/50")
//     }

//     if (!draggedTask) return

//     const { task, sourceColumn } = draggedTask

//     if (sourceColumn === targetColumn) return

//     try {
//       // Update task status
//       await updateTask(params.id, task._id, {
//         status: targetColumn,
//       })

//       // Apply animation to the column
//       const targetColumnRef = getColumnRef(targetColumn)
//       if (targetColumnRef && targetColumnRef.current) {
//         targetColumnRef.current.classList.add("highlight-column")
//         setTimeout(() => {
//           if (targetColumnRef.current) {
//             targetColumnRef.current.classList.remove("highlight-column")
//           }
//         }, 800)
//       }

//       // Remove task from source column
//       setTasks((prev) => {
//         const sourceTasks = [...prev[sourceColumn]]
//         const targetTasks = [...prev[targetColumn]]

//         return {
//           ...prev,
//           [sourceColumn]: sourceTasks.filter((t) => t.id !== task._id),
//           [targetColumn]: [...targetTasks, { ...task, status: targetColumn }],
//         }
//       })

//       // Update the entire board
//       const updatedBoard = {
//         ...tasks,
//         [sourceColumn]: tasks[sourceColumn].filter((t) => t.id !== task._id),
//         [targetColumn]: [...tasks[targetColumn], { ...task, status: targetColumn }],
//       }

//       await updateKanbanBoard(params.id, updatedBoard)
//     } catch (error) {
//       console.error("Failed to move task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to move task. Please try again.",
//         variant: "destructive",
//       })
//     }

//     setDraggedTask(null)
//   }

//   // Get column ref based on column name
//   const getColumnRef = (column) => {
//     switch (column) {
//       case "todo":
//         return todoColumnRef
//       case "inProgress":
//         return inProgressColumnRef
//       case "review":
//         return reviewColumnRef
//       case "done":
//         return doneColumnRef
//       default:
//         return null
//     }
//   }

//   // Handle reordering within the same column
//   const handleTaskReorder = async (e, targetTask, targetColumn) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!draggedTask) return

//     const { task: draggedTaskData, sourceColumn } = draggedTask

//     // Only reorder within the same column
//     if (sourceColumn !== targetColumn || draggedTaskData.id === targetTask.id) return

//     try {
//       const columnTasks = [...tasks[sourceColumn]]
//       const draggedIndex = columnTasks.findIndex((t) => t.id === draggedTaskData.id)
//       const targetIndex = columnTasks.findIndex((t) => t.id === targetTask.id)

//       if (draggedIndex === -1 || targetIndex === -1) return

//       // Create a copy of the tasks for animation
//       const oldOrder = [...columnTasks]

//       // Remove the dragged task
//       const [removed] = columnTasks.splice(draggedIndex, 1)
//       // Insert at the target position
//       columnTasks.splice(targetIndex, 0, removed)

//       // Apply animation to the column
//       const sourceColumnRef = getColumnRef(sourceColumn)
//       if (sourceColumnRef && sourceColumnRef.current) {
//         sourceColumnRef.current.classList.add("highlight-column")
//         setTimeout(() => {
//           if (sourceColumnRef.current) {
//             sourceColumnRef.current.classList.remove("highlight-column")
//           }
//         }, 800)
//       }

//       // Animate the reordering
//       // If dragging from bottom to top (draggedIndex > targetIndex)
//       if (draggedIndex > targetIndex) {
//         // Cards between target and dragged need to shift down
//         for (let i = targetIndex; i < draggedIndex; i++) {
//           const taskElement = document.getElementById(`task-${oldOrder[i].id}`)
//           if (taskElement) {
//             taskElement.classList.add("shift-down")
//             setTimeout(() => {
//               taskElement.classList.remove("shift-down")
//             }, 300)
//           }
//         }
//       }
//       // If dragging from top to bottom (draggedIndex < targetIndex)
//       else if (draggedIndex < targetIndex) {
//         // Cards between dragged and target need to shift up
//         for (let i = draggedIndex + 1; i <= targetIndex; i++) {
//           const taskElement = document.getElementById(`task-${oldOrder[i].id}`)
//           if (taskElement) {
//             taskElement.classList.add("shift-up")
//             setTimeout(() => {
//               taskElement.classList.remove("shift-up")
//             }, 300)
//           }
//         }
//       }

//       // Update state with smooth animation
//       setTimeout(() => {
//         setTasks((prev) => ({
//           ...prev,
//           [sourceColumn]: columnTasks,
//         }))
//       }, 50)

//       // Update the entire board
//       const updatedBoard = {
//         ...tasks,
//         [sourceColumn]: columnTasks,
//       }

//       await updateKanbanBoard(params.id, updatedBoard)
//     } catch (error) {
//       console.error("Failed to reorder task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to reorder task. Please try again.",
//         variant: "destructive",
//       })
//     }

//     setDraggedTask(null)
//   }

//   // Add a new function to handle drag over a task
//   const handleDragOverTask = (e, task, column) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!draggedTask || draggedTask.task._id === task._id) return

//     // Only show placeholder in the same column
//     if (draggedTask.sourceColumn !== column) return

//     const taskElement = e.currentTarget
//     const boundingRect = taskElement.getBoundingClientRect()
//     const mouseY = e.clientY
//     const threshold = boundingRect.top + boundingRect.height / 2

//     // Remove any existing placeholders
//     document.querySelectorAll(".task-placeholder").forEach((el) => el.remove())

//     // Create placeholder
//     const placeholder = document.createElement("div")
//     placeholder.className = "task-placeholder"

//     // Insert placeholder before or after the task based on mouse position
//     if (mouseY < threshold) {
//       taskElement.parentNode.insertBefore(placeholder, taskElement)
//     } else {
//       if (taskElement.nextSibling) {
//         taskElement.parentNode.insertBefore(placeholder, taskElement.nextSibling)
//       } else {
//         taskElement.parentNode.appendChild(placeholder)
//       }
//     }

//     // Auto-remove placeholder after a short delay
//     setTimeout(() => {
//       if (placeholder.parentNode) {
//         placeholder.parentNode.removeChild(placeholder)
//       }
//     }, 2000)
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6 space-y-6">
//         <div className="h-8 w-40 bg-muted animate-pulse rounded-md"></div>
//         <div className="h-12 w-64 bg-muted animate-pulse rounded-md"></div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div
//               key={i}
//               className="h-96 bg-muted/20 animate-pulse rounded-lg border-2 border-dashed border-muted-foreground/25"
//             ></div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <style jsx global>{`
//         .highlight-column {
//           background-color: rgba(var(--primary-rgb), 0.1);
//           transition: background-color 0.5s ease;
//         }
        
//         .kanban-task {
//           transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
//           position: relative;
//           z-index: 1;
//         }
        
//         .kanban-task:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//         }
        
//         .kanban-task.dragging {
//           opacity: 0.7;
//           transform: scale(1.02);
//           box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//           z-index: 10;
//         }
        
//         .task-placeholder {
//           border: 2px dashed hsl(var(0,0,0.1);
//           z-index: 10;
//         }
        
//         .task-placeholder {
//           border: 2px dashed hsl(var(--primary));
//           background-color: rgba(var(--primary-rgb), 0.05);
//           border-radius: 0.5rem;
//           height: 120px;
//           margin-bottom: 1rem;
//           animation: pulse 1.5s infinite ease-in-out;
//         }
        
//         @keyframes pulse {
//           0% { opacity: 0.6; }
//           50% { opacity: 0.8; }
//           100% { opacity: 0.6; }
//         }
        
//         @keyframes task-added {
//           0% { opacity: 0; transform: scale(0.8); }
//           100% { opacity: 1; transform: scale(1); }
//         }
        
//         .task-added {
//           animation: task-added 0.3s ease forwards;
//         }
        
//         .task-container {
//           transition: transform 0.3s ease, margin 0.3s ease;
//         }
        
//         .task-container.shift-down {
//           transform: translateY(130px);
//         }
        
//         .task-container.shift-up {
//           transform: translateY(-130px);
//         }
        
//         .column-content {
//           position: relative;
//         }
//       `}</style>

//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href={`/dashboard/projects-manage/${params.id}`}>
//             <ChevronLeft className="h-4 w-4" />
//             Back to Project
//           </Link>
//         </Button>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">{projectTitle} - Kanban Board</h1>
//           <p className="text-muted-foreground">Manage tasks and track progress</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm" onClick={() => setIsNewColumnDialogOpen(true)}>
//             <Plus className="h-4 w-4 mr-1" />
//             Add Column
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* To Do Column */}
//         <div
//           ref={todoColumnRef}
//           className="space-y-4 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 transition-colors duration-300"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={(e) => handleDrop(e, "todo")}
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">To Do</h2>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openAddTaskDialog("todo")}>
//               <Plus className="h-4 w-4" />
//               <span className="sr-only">Add task</span>
//             </Button>
//           </div>
//           <div className="space-y-4 column-content">
//             {tasks.todo.map((task) => (
//               <div
//                 key={task._id}
//                 id={`task-${task._id}`}
//                 className="kanban-task task-added task-container"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task, "todo")}
//                 onDragEnd={handleDragEnd}
//                 onDragOver={(e) => handleDragOverTask(e, task, "todo")}
//                 onDrop={(e) => handleTaskReorder(e, task, "todo")}
//               >
//                 <KanbanTask id={task._id} task={task} onEdit={() => openEditTaskDialog(task, "todo")} />
//               </div>
//             ))}
//             {tasks.todo.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
//                 <p className="text-sm">No tasks yet</p>
//                 <Button variant="ghost" size="sm" className="mt-2" onClick={() => openAddTaskDialog("todo")}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Task
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* In Progress Column */}
//         <div
//           ref={inProgressColumnRef}
//           className="space-y-4 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 transition-colors duration-300"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={(e) => handleDrop(e, "inProgress")}
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">In Progress</h2>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openAddTaskDialog("inProgress")}>
//               <Plus className="h-4 w-4" />
//               <span className="sr-only">Add task</span>
//             </Button>
//           </div>
//           <div className="space-y-4 column-content">
//             {tasks.inProgress.map((task) => (
//               <div
//                 key={task._id}
//                 id={`task-${task._id}`}
//                 className="kanban-task task-added task-container"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task, "inProgress")}
//                 onDragEnd={handleDragEnd}
//                 onDragOver={(e) => handleDragOverTask(e, task, "inProgress")}
//                 onDrop={(e) => handleTaskReorder(e, task, "inProgress")}
//               >
//                 <KanbanTask id={task._id} task={task} onEdit={() => openEditTaskDialog(task, "inProgress")} />
//               </div>
//             ))}
//             {tasks.inProgress.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
//                 <p className="text-sm">No tasks in progress</p>
//                 <Button variant="ghost" size="sm" className="mt-2" onClick={() => openAddTaskDialog("inProgress")}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Task
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Review Column */}
//         <div
//           ref={reviewColumnRef}
//           className="space-y-4 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 transition-colors duration-300"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={(e) => handleDrop(e, "review")}
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Review</h2>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openAddTaskDialog("review")}>
//               <Plus className="h-4 w-4" />
//               <span className="sr-only">Add task</span>
//             </Button>
//           </div>
//           <div className="space-y-4 column-content">
//             {tasks.review.map((task) => (
//               <div
//                 key={task._id}
//                 id={`task-${task._id}`}
//                 className="kanban-task task-added task-container"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task, "review")}
//                 onDragEnd={handleDragEnd}
//                 onDragOver={(e) => handleDragOverTask(e, task, "review")}
//                 onDrop={(e) => handleTaskReorder(e, task, "review")}
//               >
//                 <KanbanTask id={task._id} task={task} onEdit={() => openEditTaskDialog(task, "review")} />
//               </div>
//             ))}
//             {tasks.review.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
//                 <p className="text-sm">No tasks in review</p>
//                 <Button variant="ghost" size="sm" className="mt-2" onClick={() => openAddTaskDialog("review")}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Task
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Done Column */}
//         <div
//           ref={doneColumnRef}
//           className="space-y-4 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 transition-colors duration-300"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={(e) => handleDrop(e, "done")}
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Done</h2>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openAddTaskDialog("done")}>
//               <Plus className="h-4 w-4" />
//               <span className="sr-only">Add task</span>
//             </Button>
//           </div>
//           <div className="space-y-4 column-content">
//             {tasks.done.map((task) => (
//               <div
//                 key={task._id}
//                 id={`task-${task._id}`}
//                 className="kanban-task task-added task-container"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task, "done")}
//                 onDragEnd={handleDragEnd}
//                 onDragOver={(e) => handleDragOverTask(e, task, "done")}
//                 onDrop={(e) => handleTaskReorder(e, task, "done")}
//               >
//                 <KanbanTask id={task._id} task={task} onEdit={() => openEditTaskDialog(task, "done")} />
//               </div>
//             ))}
//             {tasks.done.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
//                 <p className="text-sm">No completed tasks</p>
//                 <Button variant="ghost" size="sm" className="mt-2" onClick={() => openAddTaskDialog("done")}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Task
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Task Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add New Task</DialogTitle>
//             <DialogDescription>Create a new task for your project.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="task-title">Title</Label>
//               <Input
//                 id="task-title"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                 placeholder="Enter task title"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="task-description">Description</Label>
//               <Textarea
//                 id="task-description"
//                 value={newTask.description}
//                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//                 placeholder="Describe the task"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="task-priority">Priority</Label>
//               <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" onClick={handleAddTask}>
//               Add Task
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Task Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit Task</DialogTitle>
//             <DialogDescription>Make changes to the task.</DialogDescription>
//           </DialogHeader>
//           {editingTask && (
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-task-title">Title</Label>
//                 <Input
//                   id="edit-task-title"
//                   value={editingTask.title}
//                   onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
//                   placeholder="Enter task title"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-task-description">Description</Label>
//                 <Textarea
//                   id="edit-task-description"
//                   value={editingTask.description}
//                   onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
//                   placeholder="Describe the task"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-task-priority">Priority</Label>
//                 <Select
//                   value={editingTask.priority}
//                   onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           )}
//           <DialogFooter className="flex justify-between">
//             <Button type="button" variant="destructive" onClick={handleDeleteTask}>
//               <Trash2 className="mr-2 h-4 w-4" />
//               Delete
//             </Button>
//             <Button type="button" onClick={handleEditTask}>
//               <Pencil className="mr-2 h-4 w-4" />
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Column Dialog */}
//       <Dialog open={isNewColumnDialogOpen} onOpenChange={setIsNewColumnDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add New Column</DialogTitle>
//             <DialogDescription>Create a new column for your kanban board.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="column-title">Title</Label>
//               <Input
//                 id="column-title"
//                 value={newColumnTitle}
//                 onChange={(e) => setNewColumnTitle(e.target.value)}
//                 placeholder="Enter column title"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" onClick={handleAddColumn}>
//               Add Column
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }







"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react"
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getKanbanBoard, updateKanbanBoard, createTask, updateTask, deleteTask, getProject } from "@/lib/api"
import { KanbanColumn } from "@/components/projects/kanban-column"
import { KanbanTask } from "@/components/projects/kanban-task"

export default function KanbanBoard({ params }) {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] })
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ])
  const [projectTitle, setProjectTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: {
      name: "Unassigned",
      avatar: "",
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [currentColumn, setCurrentColumn] = useState("todo")
  const [editingTask, setEditingTask] = useState(null)
  const { toast } = useToast()

  // Refs for columns to apply animation
  const todoRef = useRef(null)
  const inProgressRef = useRef(null)
  const reviewRef = useRef(null)
  const doneRef = useRef(null)

  const columnRefs = useRef({
    todo: todoRef,
    inProgress: inProgressRef,
    review: reviewRef,
    done: doneRef,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardData, projectData] = await Promise.all([getKanbanBoard(params.id), getProject(params.id)])

        setTasks(boardData)
        if (projectData) {
          setProjectTitle(projectData.title)
        }

        // Update columns based on board data
        const existingColumns = Object.keys(boardData).map((id) => ({
          id,
          title:
            id === "todo"
              ? "To Do"
              : id === "inProgress"
                ? "In Progress"
                : id === "review"
                  ? "Review"
                  : id === "done"
                    ? "Done"
                    : id.charAt(0).toUpperCase() + id.slice(1),
        }))

        if (existingColumns.length > 0) {
          setColumns(existingColumns)
        }
      } catch (error) {
        console.error("Failed to fetch kanban data:", error)
        toast({
          title: "Error",
          description: "Failed to load kanban board. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    try {
      const createdTask = await createTask(params.id, currentColumn, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        assignee: newTask.assignee,
      })

      setTasks((prev) => ({
        ...prev,
        [currentColumn]: [...prev[currentColumn], createdTask],
      }))

      toast({
        title: "Task created",
        description: "New task has been added to the board",
      })

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignee: {
          name: "Unassigned",
          avatar: "",
        },
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = async () => {
    if (!editingTask) return

    const { _id, column } = editingTask

    try {
      const updatedTask = await updateTask(params.id, _id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
      })

      if (updatedTask) {
        setTasks((prev) => {
          const columnTasks = [...prev[column]]
          const taskIndex = columnTasks.findIndex((task) => task._id === _id)

          if (taskIndex !== -1) {
            columnTasks[taskIndex] = updatedTask
          }

          return {
            ...prev,
            [column]: columnTasks,
          }
        })

        toast({
          title: "Task updated",
          description: "Task has been successfully updated",
        })
      }
    } catch (error) {
      console.error("Failed to update task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }

    setIsEditDialogOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async () => {
    if (!editingTask) return

    const { _id, column } = editingTask

    try {
      const success = await deleteTask(params.id, _id)

      if (success) {
        setTasks((prev) => {
          const columnTasks = [...prev[column]]
          const filteredTasks = columnTasks.filter((task) => task._id !== _id)

          return {
            ...prev,
            [column]: filteredTasks,
          }
        })

        toast({
          title: "Task deleted",
          description: "Task has been successfully removed from the board",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }

    setIsEditDialogOpen(false)
    setEditingTask(null)
  }

  const handleDuplicateTask = async () => {
    if (!editingTask) return

    const { column } = editingTask

    try {
      const duplicatedTask = await createTask(params.id, column, {
        title: `${editingTask.title} (Copy)`,
        description: editingTask.description,
        priority: editingTask.priority,
        assignee: editingTask.assignee,
      })

      setTasks((prev) => ({
        ...prev,
        [column]: [...prev[column], duplicatedTask],
      }))

      toast({
        title: "Task duplicated",
        description: "Task has been successfully duplicated",
      })
    } catch (error) {
      console.error("Failed to duplicate task:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate task. Please try again.",
        variant: "destructive",
      })
    }

    setIsEditDialogOpen(false)
    setEditingTask(null)
  }

  const openAddTaskDialog = (column) => {
    setCurrentColumn(column)
    setIsDialogOpen(true)
  }

  const openEditTaskDialog = (task, column) => {
    setEditingTask({ ...task, column })
    setIsEditDialogOpen(true)
  }

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Column title is required",
        variant: "destructive",
      })
      return
    }

    // Create a valid ID from the title (lowercase, no spaces)
    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, "")

    // Check if column with this ID already exists
    if (columns.some((col) => col.id === columnId)) {
      toast({
        title: "Validation Error",
        description: "A column with a similar name already exists",
        variant: "destructive",
      })
      return
    }

    try {
      // Add new column to state
      const updatedColumns = [...columns, { id: columnId, title: newColumnTitle }]
      setColumns(updatedColumns)

      // Add new empty column to tasks
      const updatedTasks = {
        ...tasks,
        [columnId]: [],
      }
      setTasks(updatedTasks)

      // Update the board on the server
      await updateKanbanBoard(params.id, updatedTasks)

      toast({
        title: "Column added",
        description: "New column has been added to the board",
      })

      setNewColumnTitle("")
      setIsNewColumnDialogOpen(false)
    } catch (error) {
      console.error("Failed to add column:", error)
      toast({
        title: "Error",
        description: "Failed to add column. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!active || !over) return

    const taskId = active.id
    const sourceColumn = active.data.current?.column
    const destinationColumn = over.id

    // If dropped in the same column or no valid destination, do nothing
    if (sourceColumn === destinationColumn || !destinationColumn) return

    try {
      // Find the task in the source column
      const taskToMove = tasks[sourceColumn].find((task) => task._id === taskId)

      if (!taskToMove) {
        console.error("Task not found in source column")
        return
      }

      // Update task status on the server
      await updateTask(params.id, taskId, {
        status: destinationColumn,
      })

      // Update local state - remove from source column and add to destination column
      setTasks((prev) => {
        // Create a new object to avoid mutation
        const newTasks = { ...prev }

        // Remove from source column
        newTasks[sourceColumn] = prev[sourceColumn].filter((task) => task._id !== taskId)

        // Add to destination column with updated status
        newTasks[destinationColumn] = [...prev[destinationColumn], { ...taskToMove, status: destinationColumn }]

        return newTasks
      })

      // Highlight the destination column
      if (columnRefs.current[destinationColumn]?.current) {
        const column = columnRefs.current[destinationColumn].current
        column.classList.add("highlight-column")
        setTimeout(() => {
          column.classList.remove("highlight-column")
        }, 800)
      }

      toast({
        title: "Task moved",
        description: `Task moved to ${columns.find((col) => col.id === destinationColumn)?.title || destinationColumn}`,
      })
    } catch (error) {
      console.error("Failed to move task:", error)
      toast({
        title: "Error",
        description: "Failed to move task. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="h-8 w-40 bg-muted animate-pulse rounded-md"></div>
        <div className="h-12 w-64 bg-muted animate-pulse rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-muted/20 animate-pulse rounded-lg border-2 border-dashed border-muted-foreground/25"
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <style jsx global>{`
        .highlight-column {
          background-color: rgba(var(--primary-rgb), 0.1);
          transition: background-color 0.5s ease;
        }
        
        .kanban-task {
          transition: transform 0.3s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 1;
        }
        
        .kanban-task:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .kanban-task.dragging {
          opacity: 0.7;
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
        
        @keyframes task-added {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .task-added {
          animation: task-added 0.3s ease forwards;
        }
      `}</style>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/projects-manage/${params.id}`}>
            <ChevronLeft className="h-4 w-4" />
            Back to Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectTitle} - Kanban Board</h1>
          <p className="text-muted-foreground">Manage tasks and track progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsNewColumnDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Column
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} ref={columnRefs.current[column.id]}>
              <KanbanColumn id={column.id} title={column.title} onAddTask={() => openAddTaskDialog(column.id)}>
                {tasks[column.id]?.map((task) => (
                  <div key={task._id} className="kanban-task task-added">
                    <KanbanTask
                      id={task._id}
                      task={task}
                      onEdit={() => openEditTaskDialog(task, column.id)}
                      data-column={column.id}
                    />
                  </div>
                ))}
                {(!tasks[column.id] || tasks[column.id].length === 0) && (
                  <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
                    <p className="text-sm">No tasks yet</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => openAddTaskDialog(column.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                )}
              </KanbanColumn>
            </div>
          ))}
        </div>
      </DndContext>

      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for your project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe the task"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to the task.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-task-title">Title</Label>
                <Input
                  id="edit-task-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea
                  id="edit-task-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Describe the task"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-priority">Priority</Label>
                <Select
                  value={editingTask.priority}
                  onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDeleteTask}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button type="button" onClick={handleEditTask}>
              <Pencil className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Column Dialog */}
      <Dialog open={isNewColumnDialogOpen} onOpenChange={setIsNewColumnDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogDescription>Create a new column for your kanban board.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title">Title</Label>
              <Input
                id="column-title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddColumn}>
              Add Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

