"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, FileText, Briefcase, ShoppingCart, InboxIcon, Eye } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"


export default function Page() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState(null)

  const fetchNotifications = async () => {
    const [orderResponse, submissionsResponse] = await Promise.all([
      fetch("/api/order"),
      fetch("/api/submissions"),
    ]);

    const orderData = await orderResponse.json();
    const submissionsData = await submissionsResponse.json();

    if (orderData.success && submissionsData.success) {
      const orders = orderData.data.map((order) => ({
        ...order,
        type: "order",
      }));
      const submissions = submissionsData.data.map((submission) => ({
        ...submission,
        type: "submission",
      }));

      let allNotifications = [...orders, ...submissions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const notViewedCount = allNotifications.filter(notification => !notification.viewed).length;
      if (notViewedCount <= 5) {
        allNotifications = allNotifications.slice(0, 6);
      }

      setRecentActivity(allNotifications);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
    fetchDashboardData()
  }, [])
  
  

  if (loading) {
    return <p className="text-center py-10">Loading...</p>
  }

  const { stats } = dashboardData || {}

  const chartData = [
    { name: "Projects", value: stats?.totalProjects || 0 },
    { name: "Services", value: stats?.totalGigs || 0 },
    { name: "Blogs", value: stats?.totalBlogs || 0 },
    { name: "Orders", value: stats?.totalOrders || 0 },
    { name: "Submissions", value: stats?.totalSubmissions || 0 },
  ]


console.log(recentActivity);

  return (
    <div className="">
    

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGigs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBlogs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <InboxIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center">
                {activity.type === 'order' ? (
                  <Link href={`/dashboard/orders`}>
                    <ShoppingCart className="mr-4 h-4 w-4 opacity-70" />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none">{activity.package.title}</p>
                        <p className="text-sm font-medium leading-none">${activity.package.price}</p>
                      </div>

                      <p className="text-sm text-muted-foreground">Order Number: {activity.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">Client: {activity.client.name} <span className="text-primary-foreground" href={`mailto:${activity.client.email}`}>{activity.client.email}</span></p>
                      <p className="text-sm text-muted-foreground">Status: {activity.status}</p>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/dashboard/submissions`}>
                    <InboxIcon className="mr-4 h-4 w-4 opacity-70" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">Email: {activity.email}</p>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                    </div>
                  </Link>
                )}
                <div className="ml-auto font-medium">{new Date(activity.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

