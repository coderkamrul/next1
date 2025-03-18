"use client"

import { useEffect, useState } from "react"
import { BarChart3, DollarSign, Users, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/api"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    activeProjects: 0,
    projectsGrowth: 0,
    totalClients: 0,
    clientsGrowth: 0,
    completedProjects: 0,
    completedGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats({
          totalRevenue: data.totalRevenue,
          revenueGrowth: data.revenueGrowth,
          activeProjects: data.activeProjects,
          projectsGrowth: data.projectsGrowth,
          totalClients: data.totalClients,
          clientsGrowth: data.clientsGrowth,
          completedProjects: data.completedProjects,
          completedGrowth: data.completedGrowth,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-7 w-32 animate-pulse rounded bg-muted"></div>
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(stats.totalRevenue)
            )}
          </div>
          <div className="flex items-center space-x-2">
            {stats.revenueGrowth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <p className={`text-xs ${stats.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.revenueGrowth > 0 ? "+" : ""}
              {stats.revenueGrowth}% from last month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted"></div> : stats.activeProjects}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-500">+{stats.projectsGrowth} new this week</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted"></div> : stats.totalClients}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-500">+{stats.clientsGrowth} new clients</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted"></div> : stats.completedProjects}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-500">+{stats.completedGrowth} this quarter</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

