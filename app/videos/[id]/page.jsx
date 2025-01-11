'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AccessCode from '@/components/AccessCode'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import useAddCopyButtons from '@/hooks/useAddCopyButtons'
import InstructionBlock from '@/components/InstructionBlock'
import { useSession } from 'next-auth/react'
import YouTube from 'react-youtube'

export default function VideoPage({ params: paramsPromise, codeString }) {
  const params = React.use(paramsPromise)
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session } = useSession()
  useEffect(() => {
    fetchProject()
  }, [params.id])

  useAddCopyButtons()
  const fetchProject = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/youtube/${params.id}`)
      if (!res.ok) {
        throw new Error('Failed to fetch video')
      }
      const data = await res.json()
      if (data.success) {
        setProject(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch video')
      }
    } catch (err) {
      setError(err.message)
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin h-5 w-5 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        {error}
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Video not found
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto md:p-4'>
      <div className='lg:grid lg:grid-cols-[400px,1fr] gap-8'>
        {/* Sticky Sidebar */}
        <div className='lg:sticky lg:top-20 lg:h-fit space-y-8 p-4 lg:p-0'>
          <Link
            href='/videos'
            className='inline-flex items-center text-base text-muted-foreground hover:text-foreground mb-2 md:mb-6 md:px-4 lg:px-0'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go back to videos
          </Link>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                {project.title}
              </h3>
              <Badge className='text-sm' variant='outline'>
                {project.category}
              </Badge>
            </div>
            <p className='text-base text-muted-foreground'>
              {project.description}
            </p>
          </div>

          <div className='flex gap-4'>
            <AccessCode />
            <Link href={project.link} target='_blank' rel='noopener noreferrer'>
              <Button className='w-full' variant='outline'>
                See on YouTube
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='space-y-8 py-4 md:px-8 md:border-l'>
          {project.link && (
            <div className='mt-4 flex w-full items-center '>
              <iframe
                src={`https://www.youtube.com/embed/${project.link
                  .split('/')
                  .pop()}`}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='w-full h-[400px] rounded'
              />
            </div>
          )}

          <div className='space-y-4 mb-8 p-6 md:p-2'>
            {project.setupinstructions[0].blocks.map((instruction, index) => (
              <InstructionBlock key={index} instruction={instruction} />
            ))}
          </div>
        </div>
      </div>

      <Card className='p-8 bg-slate-900 text-white w-full my-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold'>More videos of the same</h2>
            <p className='text-slate-400'>
              View videos that have been uploaded to YouTube.
            </p>
          </div>
          <Button
            variant='secondary'
            className='whitespace-nowrap w-full sm:w-auto'
          >
            View Videos
          </Button>
        </div>
      </Card>
    </div>
  )
}
