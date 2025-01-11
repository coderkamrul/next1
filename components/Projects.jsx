'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Search, X, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

function ProjectSkeleton() {
  return (
    <Card className='group relative overflow-hidden rounded-xl border'>
      <CardContent className='p-0'>
        <div className='relative overflow-hidden'>
          <div className='w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse' />
          <div className='flex flex-col p-4'>
            <div className='h-6 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
            <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2' />
            <div className='h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1' />
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-t p-4'>
        <div className='h-4 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
      </CardFooter>
    </Card>
  )
}

export default function ProjectsPage() {
  const [projectss, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState([])
  const projectsPerPage = 8

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const res = await fetch('/api/projects/all')
    const data = await res.json()
    if (data.success) {
      setProjects(data.data)
      setIsLoading(false)
      const tags = data.data.map((project) => project.tags).flat()
      const uniqueTags = Array.from(new Set(tags))
      setFilters(uniqueTags)
    }
  }

  const filteredProjects = projectss.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some(
        (filter) =>
          project.details.framework.includes(filter) ||
          project.details.useCase.includes(filter) ||
          project.details.css.includes(filter) ||
          project.tags.includes(filter) ||
          project.techStack.includes(filter)
      )
    return matchesSearch && matchesFilters
  })

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveFilters([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  const pageCount = Math.ceil(filteredProjects.length / projectsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  return (
    <div className='min-h-screen pb-16'>
      {/* Header */}
      <div className='bg-slate-900 text-white py-12 px-4 mb-8 rounded-lg mx-4'>
        <div className='container mx-auto max-w-7xl text-center'>
          <h1 className='text-3xl font-bold mb-2'>
            The projects I have done on YouTube
          </h1>
          <p className='text-slate-400 mb-4'>
            Check out my YouTube channel for more content!
          </p>
          <Button className='bg-purple-600 hover:bg-purple-700'>
            <Youtube className='mr-2 h-4 w-4' />
            View Videos
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div className='relative mb-4 w-full max-w-lg'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search projects...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
            {(activeFilters.length > 0 || searchQuery) && (
              <Button
                variant='outline'
                size='sm'
                onClick={clearFilters}
                className='ml-2 mb-4'
              >
                <X className='h-4 w-4 mr-1' />
                Clear Filters
              </Button>
            )}
          </div>

          <div className='flex flex-wrap gap-2 items-center'>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? 'default' : 'outline'}
                className='cursor-pointer flex-grow'
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          initial='hidden'
          animate='show'
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {isLoading
            ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <ProjectSkeleton />
                  </motion.div>
                ))
            : paginatedProjects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className='group overflow-hidden'>
                    <CardContent className='p-0'>
                      <Link href={`/projects/${project._id}`}>
                        <div className='relative'>
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={500}
                            height={300}
                            className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
                          />
                          <div className='p-4'>
                            <h3 className='font-semibold mb-2 group-hover:text-purple-600'>
                              {project.title}
                            </h3>
                            <p className='text-sm text-muted-foreground line-clamp-2'>
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                    <CardFooter className='border-t p-4 flex justify-between items-center'>
                      <span className='text-sm text-muted-foreground'>
                        {project.details.framework}
                      </span>

                      <div className='flex gap-3'>
                        <div>
                          <Link
                            href={project.github}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-600 hover:text-primary'
                          >
                            <Github className='h-5 w-5 hover:scale-110' />
                          </Link>
                        </div>
                        <div>
                          <Link
                            href={project.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-600 hover:text-primary'
                          >
                            <ExternalLink className='h-5 w-5 hover:scale-110' />
                          </Link>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        {/* Pagination */}
        {!isLoading && pageCount > 1 && (
          <div className='flex justify-center gap-2 mt-8'>
            <Button
              variant='outline'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant='outline'
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
