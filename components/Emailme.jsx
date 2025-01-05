'use client'

import React from 'react'
import { ArrowRight, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { DialogClose } from '@radix-ui/react-dialog'

const EmailForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 '>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email *</Label>
          <Input
            id='email'
            type='email'
            {...register('email', { required: 'Email is required' })}
            placeholder='Your email'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...register('name')} placeholder='Your name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              type='tel'
              {...register('phone')}
              placeholder='Your phone number'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='message'>Message</Label>
          <Textarea
            id='message'
            {...register('message')}
            placeholder='Your message'
            className='min-h-[150px]'
          />
        </div>
      </div>

      <div className='flex justify-end gap-4'>
        <DialogClose className='border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded'>
          Cancel
        </DialogClose>
        <Button type='submit' variant='animated' className=' w-fit'>
          Send
        </Button>
      </div>
    </form>
  )
}

const EmailMe = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleSubmit = async (data) => {
    console.log('Form submitted:', data)
    // Add your form submission logic here
  }

  const TriggerButton = React.forwardRef((props, ref) => (
    <Button ref={ref} variant='animated' {...props} className='w-fit'>
      E-mail me
      <motion.span
        animate={{ x: [0, 3, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      >
        <ArrowRight className='ml-2 h-4 w-4' />
      </motion.span>
    </Button>
  ))
  TriggerButton.displayName = 'TriggerButton'

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <TriggerButton />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='border-b'>
            <DrawerTitle>Get in touch</DrawerTitle>
            <p className='text-sm text-muted-foreground'>
              Let's discuss your web development needs
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
            <EmailForm onSubmit={handleSubmit} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TriggerButton />
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Let's discuss your web development needs
          </p>
        </DialogHeader>
        <EmailForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

export default EmailMe
