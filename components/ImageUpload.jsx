'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function ImageUpload({ onImageUpload }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

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
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor='image-upload'>Upload Image</Label>
      <Input
        id='image-upload'
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && (
        <p className='text-sm text-muted-foreground'>Uploading...</p>
      )}
    </div>
  )
}
