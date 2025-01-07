// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState([])

//   useEffect(() => {
//     // Fetch projects from API
//     const fetchProjects = async () => {
//       const res = await fetch('/api/projects')
//       const data = await res.json()
//       setProjects(data)
//     }
//     fetchProjects()
//   }, [])

//   return (
//     <div>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-2xl font-bold'>Projects</h1>
//         <Link href='/dashboard/projects/new'>
//           <Button>Create New Project</Button>
//         </Link>
//       </div>
//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//         {projects.map((project) => (
//           <Card key={project._id}>
//             <CardHeader>
//               <CardTitle>{project.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>{project.description}</p>
//               <Link href={`/dashboard/projects/${project._id}`}>
//                 <Button variant='link'>View Details</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
import ManageProjectsTable from '@/components/ManageProjectsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ManageProjects() {
  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Projects</h1>
        <Link href='/dashboard/projects/new' className='text-primary'>
          <Button variant='outline'>Add New Project</Button>
        </Link>
      </div>
      <ManageProjectsTable />
    </div>
  )
}
