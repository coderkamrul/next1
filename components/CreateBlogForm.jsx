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

export default function CreateBlogForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    setupinstructions: '',
    tags: '',
  })
  const [editorState, setEditorState] = useState('editor')
  const [textEditor, setTextEditor] = useState({ isReady: false })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
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
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()),
          content: formData.setupinstructions,
        }),
      })

      if (res.ok) {
        router.push('/blogs')
        toast({
          title: 'Blog created',
          description: 'Your blog has been created successfully.',
        })
      } else {
        throw new Error('Failed to create blog')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create blog. Please try again.',
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
      <div>
        <Label htmlFor='content'>Content</Label>
        <Editor
          setTextEditor={setTextEditor}
          setEditorState={setEditorState}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <ImageUpload onImageUpload={handleImageUpload} />
      {formData.image && (
        <img
          src={formData.image}
          alt='Blog'
          className='mt-2 max-w-xs rounded-md'
        />
      )}
      <div>
        <Label htmlFor='tags'>Tags (comma-separated)</Label>
        <Input
          type='text'
          name='tags'
          id='tags'
          value={formData.tags}
          onChange={handleChange}
        />
      </div>
      <Button type='submit'>Create Blog</Button>
    </form>
  )
}
