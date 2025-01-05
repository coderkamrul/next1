'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Theme } from './Theme'
import { NavigationMenus } from './NavigationMenus'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Hireme from './Hireme'

const Navbar = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }

  const Logo = theme === 'dark' ? '/dark-logo.png' : '/logo.png'
  return (
    <nav className=' mx-auto inset-x-0 top-0 z-50 sticky border-b backdrop-blur-lg rounded max-w-7xl'>
      <div className='p-2'>
        <div className='flex items-center justify-between h-10'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/'>
              <Image
                src={Logo}
                className='cursor-pointer'
                alt='Logo'
                width={60}
                height={60}
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className='hidden md:block'>
            <NavigationMenus />
          </div>

          {/* Desktop Buttons */}
          <div className='flex items-center space-x-4'>
            <Hireme />

            <Theme />
            <div className='sm:hidden block'>
              <NavigationMenus />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
