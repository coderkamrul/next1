import EditProjectForm from '@/components/EditProjectForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditProject({ params }) {
  const { id } = await params
  return (
    <div className='container mx-auto px-4 py-8'>
      <Link
        href='/dashboard/projects'
        className='inline-flex items-center text-base text-muted-foreground hover:text-foreground mb-2 md:mb-6 md:px-4 lg:px-0'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Go back to projects
      </Link>
      <h1 className='text-3xl font-bold mb-6'>Edit Project</h1>
      <EditProjectForm id={id} />
    </div>
  )
}
