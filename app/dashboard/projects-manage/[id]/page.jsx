"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  Edit,
  Trash2,
  KanbanSquare,
  BarChart3,
  FileText,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getProject, deleteProject, getKanbanBoard, updateProject } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Status badge component
function StatusBadge({ status }) {
  const statusMap = {
    planning: { label: "Planning", variant: "secondary" },
    "in-progress": { label: "In Progress", variant: "default" },
    "on-hold": { label: "On Hold", variant: "outline" },
    completed: { label: "Completed", variant: "success" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

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

export default function ProjectView({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] })
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, boardData] = await Promise.all([getProject(params.id), getKanbanBoard(params.id)])

        setProject(projectData)
        setTasks(boardData)

        // Calculate task statistics
        const total = Object.values(boardData).flat().length
        const completed = boardData.done.length
        const inProgress = boardData.inProgress.length + boardData.review.length
        const pending = boardData.todo.length

        setTaskStats({
          total,
          completed,
          inProgress,
          pending,
        })
      } catch (error) {
        console.error("Failed to fetch project data:", error)
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleDeleteProject = async () => {
    try {
      const success = await deleteProject(params.id)
      if (success) {
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        })
        router.push("/dashboard/projects-manage")
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate days remaining
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      // Create a copy of the project with the updated status
      const updatedProject = {
        ...project,
        status: newStatus,
      }

      // Update the project in the database
      const result = await updateProject(params.id, updatedProject)

      // Update local state
      setProject(result)

      toast({
        title: "Status Updated",
        description: `Project status changed to ${
          newStatus === "planning"
            ? "Planning"
            : newStatus === "in-progress"
              ? "In Progress"
              : newStatus === "on-hold"
                ? "On Hold"
                : "Completed"
        }`,
      })
    } catch (error) {
      console.error("Failed to update project status:", error)
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add this helper function to get the display label for a status
  const getStatusLabel = (status) => {
    switch (status) {
      case "planning":
        return "Planning"
      case "in-progress":
        return "In Progress"
      case "on-hold":
        return "On Hold"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  // Add this helper function to get the badge variant for a status
  const getStatusVariant = (status) => {
    switch (status) {
      case "planning":
        return "secondary"
      case "in-progress":
        return "default"
      case "on-hold":
        return "outline"
      case "completed":
        return "success"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="h-8 w-40 bg-muted animate-pulse rounded-md"></div>
        <div className="h-12 w-64 bg-muted animate-pulse rounded-md"></div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-96 bg-muted animate-pulse rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects-manage">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/projects-manage">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const daysRemaining = calculateDaysRemaining(project.dueDate)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects-manage">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={project.status} />
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Created on {formatDate(project.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects-manage/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects-manage/${params.id}/kanban`}>
              <KanbanSquare className="mr-2 h-4 w-4" />
              Kanban Board
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Project Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Key details and progress of the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {project.image && (
                <div className="rounded-lg overflow-hidden border h-48 md:h-64">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description || "No description provided."}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(project.budget)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">{formatDate(project.dueDate)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Time Remaining</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    <span
                      className={`font-medium ${daysRemaining < 0 ? "text-destructive" : daysRemaining < 7 ? "text-amber-500" : ""}`}
                    >
                      {daysRemaining < 0
                        ? `${Math.abs(daysRemaining)} days overdue`
                        : daysRemaining === 0
                          ? "Due today"
                          : `${daysRemaining} days left`}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Project Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Tasks Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks Overview</CardTitle>
              <CardDescription>Status of project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo">To Do</TabsTrigger>
                  <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                  <TabsTrigger value="done">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{taskStats.total}</div>
                        <p className="text-sm text-muted-foreground">Total Tasks</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{taskStats.pending}</div>
                        <p className="text-sm text-muted-foreground">To Do</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{taskStats.inProgress}</div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{taskStats.completed}</div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Task Completion</span>
                      <span className="text-sm font-medium">
                        {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}
                      className="h-2"
                    />
                  </div>

                  <div className="mt-6">
                    <Button asChild>
                      <Link href={`/dashboard/projects-manage/${params.id}/kanban`}>
                        <KanbanSquare className="mr-2 h-4 w-4" />
                        Go to Kanban Board
                      </Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="todo" className="space-y-4 mt-4">
                  {tasks.todo.length > 0 ? (
                    <div className="space-y-3">
                      {tasks.todo.map((task) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                              </div>
                              <PriorityBadge priority={task.priority} />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={task.assignee?.avatar} />
                                  <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {task.assignee?.name || "Unassigned"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">No tasks in this category</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="inProgress" className="space-y-4 mt-4">
                  {[...tasks.inProgress, ...tasks.review].length > 0 ? (
                    <div className="space-y-3">
                      {[...tasks.inProgress, ...tasks.review].map((task) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                              </div>
                              <PriorityBadge priority={task.priority} />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={task.assignee?.avatar} />
                                  <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {task.assignee?.name || "Unassigned"}
                                </span>
                              </div>
                              <Badge variant="outline">{task.status === "inProgress" ? "In Progress" : "Review"}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">No tasks in this category</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="done" className="space-y-4 mt-4">
                  {tasks.done.length > 0 ? (
                    <div className="space-y-3">
                      {tasks.done.map((task) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                              </div>
                              <PriorityBadge priority={task.priority} />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={task.assignee?.avatar} />
                                  <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {task.assignee?.name || "Unassigned"}
                                </span>
                              </div>
                              <Badge variant="success">Completed</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">No tasks in this category</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Details about the client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={project.client?.image} />
                  <AvatarFallback>{project.client?.name?.charAt(0) || "C"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{project.client?.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client?.email}</p>
                  {project.client?.phone && <p className="text-sm text-muted-foreground">{project.client?.phone}</p>}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  View Client Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
              <CardDescription>Key metrics and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Task Completion</span>
                </div>
                <span className="font-medium">
                  {taskStats.total > 0
                    ? `${taskStats.completed}/${taskStats.total} (${Math.round((taskStats.completed / taskStats.total) * 100)}%)`
                    : "0/0 (0%)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Due Date</span>
                </div>
                <span className="font-medium">{formatDate(project.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Time Remaining</span>
                </div>
                <span
                  className={`font-medium ${daysRemaining < 0 ? "text-destructive" : daysRemaining < 7 ? "text-amber-500" : ""}`}
                >
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : daysRemaining === 0
                      ? "Due today"
                      : `${daysRemaining} days left`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Budget</span>
                </div>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(project.budget)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge
                    className="h-4 w-4 mr-2"
                    variant={
                      project.status === "planning"
                        ? "secondary"
                        : project.status === "in-progress"
                          ? "default"
                          : project.status === "on-hold"
                            ? "outline"
                            : "success"
                    }
                  />
                  <span className="text-sm">Status</span>
                </div>
                <Select value={project.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Project Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
              <CardDescription>Additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="mt-4">
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm whitespace-pre-line">
                      {project.notes || "No notes available for this project."}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="mt-4">
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm whitespace-pre-line">
                      {project.comments || "No comments available for this project."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Edit Notes
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/dashboard/projects-manage/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/dashboard/projects-manage/${params.id}/kanban`}>
                  <KanbanSquare className="mr-2 h-4 w-4" />
                  Kanban Board
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Share Project
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

