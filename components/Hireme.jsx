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
import { useMediaQuery } from '@/hooks/use-media-query'
import { TbLetterSSmall } from "react-icons/tb";
const HireOptions = () => (
  <div className='flex flex-col gap-3 py-4 px-4 md:px-0'>
    <Link
      href='https://www.fiverr.com/mojidm'
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
      href='/services'
      className='flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent'
    >
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#14A800]'>
        <TbLetterSSmall  size={50}  className='text-white'/>
      </div>
      <div className='flex-1'>
        <span className='font-medium'>Hire on Website</span>
        <p className='text-sm text-muted-foreground'>
          No extra charges, unlike Fiverr or Upwork.
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

const Hireme = () => {
  const isMobile = useMediaQuery('(max-width: 640px)')

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='outline' className='gap-2'>
            Hire me
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
        <Button variant='outline' className='gap-2'>
          Hire me
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

export default Hireme
