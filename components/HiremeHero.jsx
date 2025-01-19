import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { SiFiverr, SiGmail, SiUpwork } from 'react-icons/si'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useMediaQuery } from '@/hooks/use-media-quary'
import { ArrowRight, MessageSquareShare } from 'lucide-react'
const HireOptions = () => (
  <div className='flex flex-col gap-3 py-4 px-4 md:px-0'>
    <Link
      href='https://www.fiverr.com/s/EgbKBBD'
      className='flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent border-primary'
      target='_blank'
    >
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#1DBF73]/10'>
        <SiFiverr size={25} />
      </div>
      <div className='flex-1'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Hire on Fiverr</span>
          <span className='rounded-full bg-primary text-white px-3 py-1 text-xs font-medium dark:text-purple-600'>
            Recommended
          </span>
        </div>
        <p className='text-sm text-muted-foreground'>
          Get offers from as low as $100.
        </p>
      </div>
    </Link>

    <Link
      href='https://www.upwork.com/freelancers/~01190dc956db117d5d?mp_source=share'
      className='flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent'
      target='_blank'
    >
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#14A800]/10'>
        <SiUpwork size={22} />
      </div>
      <div className='flex-1'>
        <span className='font-medium'>Hire on Upwork</span>
        <p className='text-sm text-muted-foreground'>
          Starting from $10 per hour.
        </p>
      </div>
    </Link>

    <Link
      href='mailto:kamrulhasan13020@gmail.com'
      className='flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent'
    >
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
        <SiGmail size={22} />
      </div>
      <div className='flex-1'>
        <span className='font-medium'>Send an email</span>
        <p className='text-sm text-muted-foreground'>
          Contact for a custom youtube video partnership.
        </p>
      </div>
    </Link>
  </div>
)

const HiremeHero = () => {
  const isMobile = useMediaQuery('(max-width: 640px)')

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            href='/contact'
            variant='outline'
            className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent h-10 w-full sm:w-auto py-3 px-8 text-base sm:text-lg hover:text-primary transition duration-300 hover:border-slate-900 dark:hover:border-gray-300'
          >
            <MessageSquareShare className='!h-5 !w-5' />
            Hire Me
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>Let us work together</DrawerTitle>
            <p className='text-sm text-muted-foreground'>
              Send me a message on one of these platforms.
            </p>
          </DrawerHeader>
          <HireOptions />
        </DrawerContent>
      </Drawer>
    )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          href='/contact'
          variant='outline'
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent h-10 w-full sm:w-auto py-3 px-8 text-base sm:text-lg hover:text-primary transition duration-300 hover:border-slate-900 dark:hover:border-gray-300'
        >
          <MessageSquareShare className='!h-5 !w-5' />
          Hire Me
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Let us work together</DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Send me a message on one of these platforms.
          </p>
        </DialogHeader>
        <HireOptions />
        <DialogClose className='flex justify-end'>
          <span className='border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded'>
            Close
          </span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default HiremeHero
