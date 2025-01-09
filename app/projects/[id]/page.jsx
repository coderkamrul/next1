'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AccessCode from '@/components/AccessCode'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import parse from 'html-react-parser'
import useAddCopyButtons from '@/hooks/useAddCopyButtons'
import InstructionBlock from '@/components/InstructionBlock'

export default function ProjectPage({ params: paramsPromise, codeString }) {
  const params = React.use(paramsPromise)
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  useAddCopyButtons()
  const fetchProject = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${params.id}`)
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }
      const data = await res.json()
      if (data.success) {
        setProject(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch project')
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
        Project not found
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto md:p-4'>
      <div className='lg:grid lg:grid-cols-[400px,1fr] gap-8'>
        {/* Sticky Sidebar */}
        <div className='lg:sticky lg:top-20 lg:h-fit space-y-8 p-4 lg:p-0'>
          <Link
            href='/projects'
            className='inline-flex items-center text-base text-muted-foreground hover:text-foreground mb-2 md:mb-6 md:px-4 lg:px-0'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go back to projects
          </Link>
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold'>{project.title}</h1>
            <p className='text-lg text-muted-foreground'>
              {project.description}
            </p>
          </div>

          <div className='space-y-6'>
            {Object.entries(project.details).map(([key, value]) => (
              <div
                key={key}
                className='flex justify-between items-center border-b pb-2 border-gray-200'
              >
                <h3 className='font-medium mb-1 capitalize'>{key}</h3>
                <Badge variant='secondary'>{value}</Badge>
              </div>
            ))}
          </div>

          <div className='flex gap-4'>
            <AccessCode />
            <Link href={project.demo} target='_blank' rel='noopener noreferrer'>
              <Button className='w-full' variant='outline'>
                Live Preview
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='space-y-8 py-4 md:px-8 md:border-l'>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
            <Image
              src={project.image}
              alt={project.title}
              fill
              className='object-cover'
              loading='lazy'
            />
          </div>

          <Card className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Tech Stack</h2>
            <ul className='list-disc pl-6 space-y-2'>
              {project.techStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </Card>

          <Card className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Tags</h2>
            <div className='flex flex-wrap gap-2'>
              {project.tags.map((tag, index) => (
                <Badge key={index} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
          <Card className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Setup Instructions</h2>
            {project.setupinstructions[0].blocks.map((instruction, index) => (
              <InstructionBlock key={index} instruction={instruction} />
            ))}
          </Card>

          <Card className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Links</h2>
            <div className='flex gap-4'>
              <Link
                href={project.github}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button variant='outline' className='flex items-center gap-2'>
                  <Github className='h-4 w-4' />
                  GitHub
                </Button>
              </Link>
              <Link
                href={project.demo}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button variant='outline' className='flex items-center gap-2'>
                  <ExternalLink className='h-4 w-4' />
                  Demo
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Card className='p-8 bg-slate-900 text-white w-full my-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold'>More projects of the same</h2>
            <p className='text-slate-400'>
              View projects that have been uploaded to YouTube.
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
