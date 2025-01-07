import Projects from '@/components/Projects'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='py-4 max-w-7xl mx-auto'>
      <Projects />
      <div className='my-6 p-6 flex md:justify-between items-center flex-wrap gap-4 md:gap-0 justify-center text-center md:text-left'>
        <div className='flex gap-2 flex-col'>
          <h1 className='text-2xl md:text-3xl font-bold text-primary'>
            More projects of the same
          </h1>
          <p className='text-md md:text-lg text-muted-foreground'>
            View projects that have been uploaded to YouTube.
          </p>
        </div>
        <Link href='/youtube'>
          <Button
            variant='default'
            className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative text-primary-foreground bg-primary hover:bg-primary/90 h-10 py-2 px-8'
          >
            View Videos
            <div className='w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100'>
              <ArrowRight className='h-4 w-4' />
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default page
