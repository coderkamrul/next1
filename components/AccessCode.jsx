'use client'

import React from 'react'
import { X, Lock, FileText, RefreshCw, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-quary'
import { DialogTrigger } from '@radix-ui/react-dialog'

const AccessCode = ({ isOpen, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const Content = () => (
    <div className='grid gap-6'>
      <div className='space-y-2 bg-accent border rounded-lg p-4'>
        <div className='flex items-center gap-2'>
          <Lock className='w-4 h-4 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>Secure Checkout</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CreditCard size={18} className='text-primary' />
            <span>Pay with Card</span>
          </div>
          <span className='font-semibold'>$9.99</span>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='font-semibold'>What you'll get</h3>
        <ul className='grid gap-3 text-sm'>
          <li className='flex items-center gap-2'>
            <FileText className='w-4 h-4 text-muted-foreground' />
            Full source code access
          </li>
          <li className='flex items-center gap-2'>
            <FileText className='w-4 h-4 text-muted-foreground' />
            Documentation and setup guide
          </li>
          <li className='flex items-center gap-2'>
            <RefreshCw className='w-4 h-4 text-muted-foreground' />
            Lifetime updates
          </li>
        </ul>
      </div>

      <Button className='w-full bg-purple-500 hover:bg-purple-600'>
        Proceed to Payment
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        Secure payment powered by Stripe
      </p>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='animated'>Access Code</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='border-b'>
            <DrawerTitle>Access Project Code</DrawerTitle>
            <p className='text-sm text-muted-foreground'>
              Get immediate access to source code after payment
            </p>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-4 top-4'
              >
                <X className='h-4 w-4' />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className='p-6'>
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='animated'>Access Code</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Access Project Code</DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Get immediate access to source code after payment
          </p>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  )
}

export default AccessCode
