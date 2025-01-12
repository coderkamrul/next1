// import React from 'react'

// export default function Page() {
//   return (
//     <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
//       <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
//         <div className='aspect-video rounded-xl bg-muted/50' />
//         <div className='aspect-video rounded-xl bg-muted/50' />
//         <div className='aspect-video rounded-xl bg-muted/50' />
//       </div>
//       <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
//     </div>
//   )
// }

'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, FileText, Film, Folder, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return <p className='text-center py-10'>Loading...</p>
  }

  if (!session) {
    return (
      <p className='text-center py-10'>
        You need to be signed in to view this page.
      </p>
    )
  }

  const { blogs, projects, videos, stats } = dashboardData || {}

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-8'>
        Welcome back, {session.user?.name}!
      </h1>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Blogs</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalBlogs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Projects
            </CardTitle>
            <Folder className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.totalProjects || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Videos</CardTitle>
            <Film className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalVideos || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Views</CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.totalViews?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content Sections */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              Recent Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {blogs?.map((blog) => (
                <Link
                  href={`/blogs/${blog._id}`}
                  key={blog._id}
                  className='flex items-center gap-3 group'
                >
                  <div className='relative w-12 h-12 rounded-lg overflow-hidden'>
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium truncate group-hover:text-primary'>
                      {blog.title}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {projects?.map((project) => (
                <Link
                  href={`/projects/${project._id}`}
                  key={project._id}
                  className='flex items-center gap-3 group'
                >
                  <div className='relative w-12 h-12 rounded-lg overflow-hidden'>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium truncate group-hover:text-primary'>
                      {project.title}
                    </h3>
                    <p className='text-sm text-muted-foreground truncate'>
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              Recent Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {videos?.map((video) => (
                <Link
                  href={video.link}
                  key={video._id}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 group'
                >
                  <div className='relative w-12 h-12 rounded-lg overflow-hidden'>
                    <Image
                      src={video.image}
                      alt={video.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium truncate group-hover:text-primary'>
                      {video.title}
                    </h3>
                    <p className='text-sm text-muted-foreground truncate'>
                      {video.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
