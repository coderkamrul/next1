import ManageReviewsTable from '@/components/ManageReviewsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ManageReviews() {
  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Reviews</h1>
        <Link href='/dashboard/reviews/new' className='text-primary'>
          <Button variant='outline'>Add New Review</Button>
        </Link>
      </div>
      <ManageReviewsTable />
    </div>
  )
}
