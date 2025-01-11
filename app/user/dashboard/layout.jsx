import UserSidebar from '@/components/UserSidebar'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='flex max-w-full mx-auto !h-[87vh]'>
      <UserSidebar />
      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  )
}
