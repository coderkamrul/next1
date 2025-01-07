'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Theme } from './Theme'
import { NavigationMenus } from './NavigationMenus'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Hireme from './Hireme'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Navbar = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const Logo = theme === 'dark' ? '/dark-logo.png' : '/logo.png'

  return (
    <nav className='mx-auto inset-x-0 top-0 z-50 sticky border-b backdrop-blur-lg rounded max-w-7xl'>
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
            {status === 'authenticated' && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={session.user.profilePicture}
                      alt={session.user.name}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href='/profile'>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => signOut()}>Logout</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : status === 'unauthenticated' ? (
              <Button variant='animated' className='w-fit !px-3 text-sm'>
                <Link href='/api/auth/signin'>Sign In</Link>
              </Button>
            ) : (
              <Button variant='animated' className='w-fit' disabled>
                Loading...
              </Button>
            )}
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
