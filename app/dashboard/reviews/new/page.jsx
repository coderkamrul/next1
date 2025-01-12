import CreateReviewForm from '@/components/CreateReviewForm'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Scroll } from 'lucide-react'
import Link from 'next/link'

export default function CreateReview() {
  return (
    <ScrollArea className='h-[90vh]'>
      <div className='container mx-auto px-4 py-8 pb-20'>
        <Link
          href='/dashboard/reviews'
          className='inline-flex items-center text-base text-muted-foreground hover:text-foreground mb-2 md:mb-6 md:px-4 lg:px-0'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Go back to reviews
        </Link>
        <h1 className='text-3xl font-bold mb-6'>Create New Review</h1>
        <CreateReviewForm />
      </div>
    </ScrollArea>
  )
}
