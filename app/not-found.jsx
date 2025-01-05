'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-white dark:bg-transparent'>
      <div className='text-center'>
        <motion.h1
          className='text-9xl font-extrabold  tracking-widest'
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.div
          className='bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute'
          initial={{ rotate: 0, scale: 0 }}
          animate={{ rotate: 12, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Page Not Found
        </motion.div>
        <motion.div
          className=' mt-5'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className='text-2xl font-bold mb-4'>
            Oops! You seem to be lost.
          </h3>
          <p className='text-lg mb-8'>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href='/' passHref>
            <Button
              variant='secondary'
              size='lg'
              className='bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300'
            >
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
      <motion.div
        className='absolute bottom-10 '
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className='text-white text-sm'>
          © 2023 Your Company. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

export default NotFound
