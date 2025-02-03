import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Project from '@/models/Project'
import Youtube from '@/models/Youtube'
import Submission from '@/models/Submissions'
import Order from '@/models/Order'
import { Gig } from '@/models/gigModels'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id

    // Fetch all data in parallel
    const [blogs, projects, videos] = await Promise.all([
      Blog.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Project.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Youtube.find({ userId }).sort({ createdAt: -1 }).limit(5),
    ])

    // Get total counts
    const [totalBlogs, totalProjects, totalVideos, totalSubmissions, totalOrders, totalGigs] = await Promise.all([
      Blog.countDocuments({ userId }),
      Project.countDocuments({ userId }),
      Youtube.countDocuments({ userId }),
      Submission.countDocuments(),
      Order.countDocuments(),
      Gig.countDocuments(),
    ])

    // Calculate total views from blogs
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)

    return NextResponse.json({
      blogs,
      projects,
      videos,
      stats: {
        totalBlogs,
        totalProjects,
        totalVideos,
        totalViews,
        totalSubmissions,
        totalOrders,
        totalGigs,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

