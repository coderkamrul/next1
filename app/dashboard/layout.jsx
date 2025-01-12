import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='flex max-w-full mx-auto overflow-hidden max-h-[87vh]'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className='md:hidden -ml-1' />
          {/* <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <Separator orientation='vertical' className='mr-2 h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link href='/dashboard'>Dashboard</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header> */}
          <main className='flex-1 p-4 md:p-8 overflow-hidden'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
