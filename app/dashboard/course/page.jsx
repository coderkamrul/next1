import ManageCourseTable from '@/components/ManageCourseTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ManageYoutube() {
  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Course</h1>
        <Link href='/dashboard/course/new' className='text-primary'>
          <Button variant='outline'>Add New Course</Button>
        </Link>
      </div>
      <ManageCourseTable />
    </div>
  )
}
