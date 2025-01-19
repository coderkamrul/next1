'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X, ExternalLink } from 'lucide-react'

export default function Preview({ link, setIsOpen }) {
  return (
    <DialogContent className='max-w-full max-h-full w-screen h-screen p-0'>
      <DialogHeader className='absolute top-4 left-4 z-50'>
        <DialogTitle className='text-white bg-[#242424] px-2 py-1 rounded'>
          Live Preview
        </DialogTitle>
      </DialogHeader>
      <div className='absolute top-4 right-4 z-50 flex space-x-2'>
        <Button
          variant='ghost'
          size='icon'
          className='text-white bg-black bg-opacity-50 hover:bg-opacity-75'
          onClick={() => window.open(link, '_blank')}
        >
          <ExternalLink className='h-4 w-4' />
          <span className='sr-only'>Open in new tab</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-white bg-black bg-opacity-50 hover:bg-opacity-75'
          onClick={() => setIsOpen(false)}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </Button>
      </div>
      <iframe
        src={link}
        className='w-full h-full border-none'
        title='Website Preview'
        sandbox='allow-scripts allow-same-origin'
      />
    </DialogContent>
  )
}
