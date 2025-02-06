import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'

export async function GET() {
  await dbConnect()

  try {
    const CourseVideos = await Course.aggregate([
      {
        $project: {
          image: 1,
          title: 1,
          category: 1,
          totalChapters: { $size: '$chapters' },
          totalLectures: {
            $sum: {
              $map: {
                input: '$chapters',
                as: 'chapter',
                in: { $size: '$$chapter.lectures' }
              }
            }
          },
          price: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    return NextResponse.json({ success: true, data: CourseVideos })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

