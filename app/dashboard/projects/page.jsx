import ManageProjectsTable from '@/components/ManageProjectsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ManageProjects() {
  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Projects</h1>
        <Link href='/dashboard/projects/new' className='text-primary'>
          <Button variant='outline'>Add New Project</Button>
        </Link>
      </div>
      <ManageProjectsTable />
    </div>
  )
}
