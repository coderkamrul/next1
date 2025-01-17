'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
  Maximize2,
  Trash2,
  Code,
  Eye,
  Pencil,
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import dynamic from 'next/dynamic'
import { PreviewModal } from '@/components/preview-modal'
import { ScrollArea } from '@/components/ui/scroll-area'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { LiveProvider, LiveEditor, LivePreview } from 'react-live'

const DynamicComponent = dynamic(
  () =>
    import('@/components/dynamic-component').then(
      (mod) => mod.DynamicComponent
    ),
  { ssr: false }
)

const previewSizes = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '100%' },
  mobile: { width: '375px', height: '100%' },
}

export default function ComponentCard({ component }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const copyCode = () => {
    if (component) {
      navigator.clipboard.writeText(component.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this component?')) {
      axios.delete(`/api/components/${component._id}`)
      router.push('/dashboard/components')
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/components/edit/${component._id}`)
  }

  return (
    <div className='max-w-7xl mx-auto p-6 '>
      <div className='flex mb-6 flex-col'>
        <div className='flex gap-2 justify-between mt-4'>
          <div>
            <h1 className='text-3xl font-bold'>{component.name}</h1>
            <p className='text-muted-foreground'>{component.description}</p>
          </div>
          {session?.user?.id === component.userId && (
            <div className='flex gap-2'>
              <Button variant='destructive' onClick={handleDelete}>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Component
              </Button>
              <Button variant='default' onClick={handleEdit}>
                <Pencil className='h-4 w-4 mr-2' />
                Edit Component
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-2'>
              <Button
                variant={showPreview ? 'default' : 'outline'}
                onClick={() => setShowPreview(true)}
              >
                <Eye className='h-4 w-4 mr-2' />
                Preview
              </Button>
              <Button
                variant={!showPreview ? 'default' : 'outline'}
                onClick={() => setShowPreview(false)}
              >
                <Code className='h-4 w-4 mr-2' />
                Code
              </Button>
            </div>
            {showPreview && (
              <div className='flex items-center gap-2'>
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className='h-4 w-4' />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className='h-4 w-4' />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className='h-4 w-4' />
                </Button>
              </div>
            )}
            {!showPreview && (
              <Button variant='ghost' size='icon' onClick={copyCode}>
                {copied ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            )}
          </div>

          {showPreview ? (
            <div className='flex items-center justify-center min-h-[500px] overflow-auto border p-4 rounded-lg bg-grid-pattern'>
              <div
                style={{
                  width: previewSizes[previewMode].width,
                  height: previewSizes[previewMode].height,
                  transition: 'width 0.3s ease',
                }}
                className='  overflow-auto max-h-[500px]'
              >
                {component.code && <DynamicComponent code={component.code} />}
                {/* {component.code && (
                  <LiveProvider code={component.code}>
                    <div className='grid grid-cols-2 gap-4'>
                      <LiveEditor className='font-mono' />
                      <LivePreview />
                    </div>
                  </LiveProvider>
                )} */}
              </div>
            </div>
          ) : (
            <div className='relative'>
              <Editor
                height='500px'
                defaultLanguage='typescript'
                value={component.code}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  readOnly: true,
                  automaticLayout: true,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <PreviewModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        {component.code && <DynamicComponent code={component.code} />}
      </PreviewModal>
    </div>
  )
}
