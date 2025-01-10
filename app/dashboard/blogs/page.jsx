import ManageBlogsTable from '@/components/ManageBlogsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ManageBlogs() {
  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Blogs</h1>
        <Link href='/dashboard/blogs/new' className='text-primary'>
          <Button variant='outline'>Add New Blog</Button>
        </Link>
      </div>
      <ManageBlogsTable />
    </div>
  )
}
