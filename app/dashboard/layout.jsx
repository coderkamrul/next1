import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='flex max-w-7xl mx-auto !h-[87vh]'>
      <Sidebar />
      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  )
}
