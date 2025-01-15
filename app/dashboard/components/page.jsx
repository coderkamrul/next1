'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function ComponentsPage() {
  const [components, setComponents] = useState([])

  useEffect(() => {
    fetch('/api/components')
      .then((res) => res.json())
      .then((data) => setComponents(data.data))
  }, [])

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>UI Components</h1>
        <Button asChild>
          <Link href='/dashboard/components/new'>
            <Plus className='mr-2 h-4 w-4' />
            Create Component
          </Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {components.map((component) => (
          <Card key={component._id}>
            <CardHeader>
              <CardTitle>{component.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {component.description}
              </p>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>
                {new Date(component.createdAt).toLocaleDateString()}
              </span>
              <Button asChild>
                <Link href={`/dashboard/components/${component._id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {components.length === 0 && (
          <div className='col-span-full text-center py-12'>
            <p className='text-muted-foreground'>
              No components yet. Create your first component!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
