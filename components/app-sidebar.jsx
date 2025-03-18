'use client'

import * as React from 'react'
import {
  AudioWaveform,
  Book,
  BookOpen,
  BookOpenCheck,
  Bot,
  Command,
  Component,
  FolderCode,
  Frame,
  FrameIcon,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  MessageSquareDiff,
  Newspaper,
  PieChart,
  PieChartIcon,
  ReceiptIcon,
  Settings2,
  SquareTerminal,
  Youtube,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects Manage',
      url: '/dashboard/projects-manage',
      icon: FolderCode,
    },
    {
      name: 'Services',
      url: '/dashboard/gig',
      icon: FolderCode,
    },
    {
      name: 'Orders',
      url: '/dashboard/orders',
      icon: FrameIcon,
    },
    {
      name: 'Projects',
      url: '/dashboard/projects',
      icon: FolderCode,
    },
    {
      name: 'Component',
      url: '/dashboard/components',
      icon: Component,
    },
    {
      name: 'Youtube',
      url: '/dashboard/youtube',
      icon: Youtube,
    },
    {
      name: 'Course',
      url: '/dashboard/course',
      icon: Book,
    },
    {
      name: 'Blogs',
      url: '/dashboard/blogs',
      icon: Newspaper,
    },
    {
      name: 'Reviews',
      url: '/dashboard/reviews',
      icon: MessageSquareDiff,
    },
    {
      name: 'Affiliate',
      url: '/dashboard/affiliates',
      icon: ReceiptIcon,
    },
    {
      name: 'Submission',
      url: '/dashboard/submissions',
      icon: BookOpenCheck,
    },
    {
      name: 'Subscrition',
      url: '/dashboard/subscrition',
      icon: PieChartIcon,
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        {/* <NavMain items={data.navMain} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
