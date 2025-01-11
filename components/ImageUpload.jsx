'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Upload, X } from 'lucide-react'

export default function ImageUpload({ onImageUpload }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setPreview(URL.createObjectURL(file))

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default') // Replace with your upload preset

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        onImageUpload(data.secure_url)
        toast({
          title: 'Image uploaded',
          description: 'Your image has been uploaded successfully.',
        })
      } catch (error) {
        console.error('Upload error:', error)
        toast({
          title: 'Upload failed',
          description:
            'There was an error uploading your image. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setUploading(false)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  })

  const removePreview = () => {
    setPreview(null)
  }

  return (
    <Card className='w-full mx-auto'>
      <CardContent className='p-6'>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className='relative'>
              <img
                src={preview}
                alt='Preview'
                className='max-w-full h-auto rounded-md'
              />
              <Button
                variant='secondary'
                size='icon'
                className='absolute top-2 right-2'
                onClick={(e) => {
                  e.stopPropagation()
                  removePreview()
                }}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              <Upload className='mx-auto h-12 w-12 text-gray-400' />
              <div className='space-y-2'>
                <p className='text-sm font-medium'>
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here'}
                </p>
                <p className='text-xs text-gray-500'>
                  or click to select a file
                </p>
              </div>
            </div>
          )}
        </div>
        {uploading && (
          <p className='mt-4 text-sm text-center text-muted-foreground'>
            Uploading...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
