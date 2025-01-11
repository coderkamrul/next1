'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/dashboard/blogs', label: 'Blogs' },
  { href: '/user/dashboard/settings', label: 'Settings' },
]

export default function UserSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className='w-64 bg-gray-100 h-full flex flex-col sticky top-0 dark:bg-gray-800'>
      <div className='p-4'>
        <Avatar>
          <AvatarImage src={session?.user?.profilePicture} />
          <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <h2 className='mt-2 text-xl font-semibold'>{session?.user?.name}</h2>
        <p className='text-sm text-gray-500'>@{session?.user?.username}</p>
      </div>
      <nav className='flex-1'>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className='w-full justify-start'
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='p-4'>
        <Button onClick={() => signOut()} variant='outline' className='w-full'>
          Logout
        </Button>
      </div>
    </div>
  )
}
