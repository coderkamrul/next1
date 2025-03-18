"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/projects/project-form"
import { useToast } from "@/hooks/use-toast"
import { createProject } from "@/lib/api"

export default function NewProject() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateProject = async (projectData) => {
    setIsSubmitting(true)
    try {
      const newProject = await createProject(projectData)
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      })
      router.push(`/dashboard/projects-manage/${newProject._id}`)
    } catch (error) {
      console.error("Failed to create project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground">Add a new project to your dashboard</p>
      </div>

      <ProjectForm onSubmit={handleCreateProject} isSubmitting={isSubmitting} />
    </div>
  )
}

