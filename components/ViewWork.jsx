'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { projects } from './data/projects'
import Link from 'next/link'
import Image from 'next/image'

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function ProjectSkeleton() {
  return (
    <Card className='group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm'>
      <CardContent className='p-0'>
        <div className='relative overflow-hidden'>
          <div className='w-full h-36 bg-gray-200 dark:bg-gray-700 animate-pulse' />
          <div className='flex flex-col p-4'>
            <div className='flex justify-between items-center w-full'>
              <div className='h-6 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
            </div>
            <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2' />
            <div className='h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1' />
          </div>
        </div>
      </CardContent>
      <CardFooter className='h-fit w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0'>
        <div className='flex items-center w-full justify-between !px-3 !py-2'>
          <div className='h-4 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
          <div className='flex gap-3'>
            <div className='h-5 w-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full' />
            <div className='h-5 w-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full' />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ViewWork() {
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshProjects = () => {
    setIsLoading(true)
    setTimeout(() => {
      const shuffled = shuffleArray(projects)
      const selected = shuffled.slice(0, 8)
      setDisplayedProjects(selected)
      setIsLoading(false)
    }, 500) // Simulate loading delay
  }

  useEffect(() => {
    refreshProjects()
  }, [])

  return (
    <section className='py-3 md:px-0 px-4 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-3xl md:text-4xl font-semibold text-primary mb-2'
          >
            View Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'
          >
            All projects have been created from scratch.
          </motion.p>
        </div>
        <div className='flex gap-4'>
          <Link
            href='/projects'
            className='text-gray-600 hover:text-primary dark:text-white'
          >
            <Button variant='outline'>
              View Projects
              <motion.div
                animate={{ x: [0, 1.5, -1.5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear',
                }}
                className='ml-2 h-4 w-4'
              >
                <ExternalLink />
              </motion.div>
            </Button>
          </Link>
          <Button
            variant='outline'
            onClick={refreshProjects}
            disabled={isLoading}
            className='p-3 hover:animate-[spin_0.3s_ease-in-out_forwards] transition-all duration-100 ease-in-out'
          >
            <RefreshCcw className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        initial='hidden'
        animate='show'
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
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
          : displayedProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className='group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg'>
                  <CardContent className='p-0'>
                    <Link href={`/projects/${project.id}`}>
                      <div className='relative overflow-hidden'>
                        <motion.div className='overflow-hidden'>
                          <Image
                            src={project.image}
                            alt={project.title}
                            loading='lazy'
                            width={500}
                            height={500}
                            className='w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110'
                          />
                        </motion.div>
                        <div className='flex flex-col p-4'>
                          <div className='flex justify-between items-center w-full'>
                            <h3 className='text-lg font-semibold hover:text-primary'>
                              {project.title}
                            </h3>
                          </div>
                          <p className='text-sm text-gray-600 mt-2 line-clamp-2 dark:text-gray-400'>
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                  <CardFooter className='h-fit w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0'>
                    <div className='flex items-center w-full justify-between !px-3 !py-2'>
                      <span>{project.tech}</span>
                      <div className='flex gap-3'>
                        <div>
                          <Link
                            href={project.link}
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
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
      </motion.div>

      {/* View More Projects Button */}
      <motion.div
        className='flex justify-center mt-12'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant='link'
          className='text-purple-600 text-lg font-medium hover:text-purple-700'
          asChild
        >
          <a href='/projects'>View More Projects</a>
        </Button>
      </motion.div>
    </section>
  )
}
