'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'
import Editor from './Editor'

export default function CreateYoutubeProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    setupinstructions: '',
    image: '',
    category: '',
    link: '',
  })
  const router = useRouter()
  const [editorState, setEditorState] = useState('editor')
  const [textEditor, setTextEditor] = useState({ isReady: false })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleImageUpload = (imageUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      image: imageUrl,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (res.ok) {
        router.push('/dashboard/youtube')
        toast({
          title: 'Project created',
          description: 'Your project has been created successfully.',
        })
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='title'>Title</Label>
        <Input
          type='text'
          name='title'
          id='title'
          required
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          name='description'
          id='description'
          required
          value={formData.description}
          onChange={handleChange}
          rows='3'
        />
      </div>
      <Editor
        setTextEditor={setTextEditor}
        setEditorState={setEditorState}
        formData={formData}
        setFormData={setFormData}
      />
      <ImageUpload onImageUpload={handleImageUpload} />
      {formData.image && (
        <img
          src={formData.image}
          alt='Project'
          className='mt-2 max-w-xs rounded-md'
        />
      )}
      <div>
        <Label htmlFor='category'>Category</Label>
        <Input
          type='text'
          name='category'
          id='category'
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor='link'>Link</Label>
        <Input
          type='url'
          name='link'
          id='link'
          required
          value={formData.link}
          onChange={handleChange}
        />
      </div>
      {formData.link && (
        <div className='mt-4 flex w-full items-center '>
          <iframe
            src={`https://www.youtube.com/embed/${formData.link
              .split('/')
              .pop()}`}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='h-[360px] w-[640px] rounded'
          />
        </div>
      )}
      <Button type='submit'>Create Project</Button>
    </form>
  )
}
