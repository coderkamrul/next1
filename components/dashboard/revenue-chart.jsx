"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function RevenueChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const stats = await getDashboardStats()

        if (stats && stats.revenueData && Array.isArray(stats.revenueData)) {
          setData(stats.revenueData)
        } else {
          // Fallback to empty array if data is not in expected format
          console.warn("Revenue data not in expected format", stats)
          setData([])

          toast({
            title: "Warning",
            description: "Revenue data format is unexpected. Chart may not display correctly.",
            variant: "warning",
          })
        }
      } catch (error) {
        console.error("Failed to fetch revenue data:", error)
        setData([])

        toast({
          title: "Error",
          description: "Failed to load revenue data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [toast])

  // Format currency values based on their magnitude
  const formatCurrency = (value) => {
    if (value === 0) return "$0"

    if (value < 1000) {
      return `$${value}`
    } else if (value < 1000000) {
      return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
    } else {
      return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue from all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-full w-full bg-muted/20 animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no data is available, show a message
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue from all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">No revenue data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate min and max for better axis display
  const minValue = Math.min(...data.map((item) => item.total))
  const maxValue = Math.max(...data.map((item) => item.total))

  // Calculate a nice domain for the Y axis
  const yAxisDomain = [
    Math.max(0, Math.floor(minValue * 0.9)), // Start at 0 or slightly below min
    Math.ceil(maxValue * 1.1), // Add 10% padding above max
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue from all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={8}
                domain={yAxisDomain}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                            <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                            <span className="font-bold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(payload[0].value)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

