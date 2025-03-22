'use client'
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProjectsTable } from "@/components/projects/projects-table"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Suspense,  useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardStats} from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { ClientSheet } from "@/components/projects/ClientSheet"

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
      const fetchProjects = async () => {
        try {
          const data = await getDashboardStats()
          setStats(data)
          console.log(data);
          
        } catch (error) {
          console.error("Failed to fetch projects:", error)
          toast({
            title: "Error",
            description: "Failed to load projects. Please try again.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
  
      fetchProjects()
    }, [toast])
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and track their progress</p>
        </div>
        <div className="flex gap-2">
        <ClientSheet/>
        <Link href="/dashboard/projects-manage/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
        </div>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Suspense fallback={<div className="h-[400px] rounded-xl border bg-card animate-pulse" />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="md:col-span-2 grid gap-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Project Completion</h3>
              <p className="text-sm text-muted-foreground">Monthly completion rate</p>
            </div>
            <div className="flex items-center justify-center h-[160px]">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32">
                  <circle cx="64" cy="64" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeDasharray="377"
                    strokeDashoffset="94.25"
                    strokeLinecap="round"
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold">{stats?.projectCompletionRate}%</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Client Satisfaction</h3>
              <p className="text-sm text-muted-foreground">Average rating</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{stats?.clientSatisfaction}</div>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={star <= stats?.clientSatisfaction ? "currentColor" : "none"}
                      stroke={star > stats?.clientSatisfaction ? "currentColor" : "none"}
                      className="w-5 h-5 text-yellow-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round" 
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-2">Based on {stats?.completedProjects} reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        </div>
        <Suspense fallback={<TableSkeleton />}>
          <ProjectsTable />
        </Suspense>
      </div>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-8 w-1/2" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b h-10 px-4 flex items-center bg-muted/50">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-[100px] mx-2" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b flex items-center">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 w-[100px] mx-2" />
          ))}
        </div>
      ))}
    </div>
  )
}

