import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { projects } from '@/components/data/projects'
import AccessCode from '@/components/AccessCode'

export default function ProjectPage({ params }) {
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    return <div>Project not found</div>
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
            <div className='flex justify-between items-center border-b pb-2 border-gray-200'>
              <h3 className='font-medium mb-1'>Framework</h3>
              <Badge variant='secondary'>{project.details.framework}</Badge>
            </div>
            <div className='flex justify-between items-center border-b pb-2 border-gray-200'>
              <h3 className='font-medium mb-1'>UseCase</h3>
              <Badge variant='secondary'>{project.details.useCase}</Badge>
            </div>
            <div className='flex justify-between items-center border-b pb-2 border-gray-200'>
              <h3 className='font-medium mb-1'>CSS</h3>
              <Badge variant='secondary'>{project.details.css}</Badge>
            </div>
            <div className='flex justify-between items-center border-b pb-2 border-gray-200'>
              <h3 className='font-medium mb-1'>Deployment</h3>
              <Badge variant='secondary'>{project.details.deployment}</Badge>
            </div>
          </div>

          <div className='flex gap-4'>
            <AccessCode />
            <Link href={project.link} target='_blank'>
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
            <div
              dangerouslySetInnerHTML={{ __html: project.setupInstructions }}
              className='prose prose-sm max-w-none prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg'
            />
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
