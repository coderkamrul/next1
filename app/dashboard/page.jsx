'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return <p>You need to be signed in to view this page.</p>
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {session.user?.name}!
      </h1>
      <p>
        This is your dashboard. You can view and manage your projects,
        submissions, and products from here.
      </p>
    </div>
  )
}
