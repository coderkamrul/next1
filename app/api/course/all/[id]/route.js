import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import Subscriber from '@/models/Subscriber'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request, { params }) {
  const { id } = await params
  await dbConnect()
  
  try {
    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ success: false }, { status: 404 })
    }
    const session = await getServerSession(authOptions)
    const subscribers = await Subscriber.find({ courseId: id }).select('userId')
    const userIds = subscribers.map((subscriber) => subscriber.userId)
    const isUserSubscribed = subscribers.some(
      (subscriber) => subscriber.userId.toString() === session?.user.id
    );

    
    const chapters = course.chapters.map((chapter) => {
      const lectures = chapter.lectures.map((lecture) => {
        const lectureData = {
          _id: lecture._id,
          title: lecture.title,
          description: lecture.description,
          duration: lecture.duration,
          preview: isUserSubscribed ? true : lecture.preview,
          createdAt: lecture.createdAt,
        }
        if (lectureData.preview) {
          lectureData.video = lecture.video
        }
        return lectureData
      })

      return {
        _id: chapter._id,
        title: chapter.title,
        lectures,
      }
    })

    const totalChapters = chapters.length
    const totalLectures = chapters.reduce((acc, chapter) => acc + chapter.lectures.length, 0)

    return NextResponse.json({ 
      success: true, 
      data: { 
        ...course.toObject(), 
        chapters, 
        totalChapters, 
        totalLectures 
      } 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

