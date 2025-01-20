'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'

import Editor from './Editor'
export default function EditProjectForm({ id }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    details: {
      framework: '',
      useCase: '',
      css: '',
      deployment: '',
    },
    setupinstructions: {},
    techStack: '',
    link: '',
    tags: '',
    github: '',
  })
  const [editorState, setEditorState] = useState(null)
  const [textEditor, setTextEditor] = useState({ isReady: false })

  const router = useRouter()
  const [content, setContent] = useState(formData.setupinstructions)
  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${id}`)
    const data = await res.json()

    if (data.success) {
      setFormData({
        ...data.data,
        techStack: data.data.techStack.join(', '),
        tags: data.data.tags.join(', '),
      })
    }
  }

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
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack.split(',').map((tech) => tech.trim()),
          tags: formData.tags.split(',').map((tag) => tag.trim()),
          setupinstructions: formData.setupinstructions,
        }),
      })

      if (res.ok) {
        router.push('/dashboard/projects')
        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        })
      } else {
        throw new Error('Failed to update project')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive',
      })
    }
  }
  const handleRichTextChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      setupinstructions: prev.setupinstructions + content,
    }))
  }
  console.log(formData)

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
        <Label htmlFor='setupinstructions'>Set Up Instruction</Label>
        <Editor
          setTextEditor={setTextEditor}
          textEditor={textEditor}
          setEditorState={setEditorState}
          formData={formData}
          setFormData={setFormData}
        />
        {/* <NovelEditor content={content} setContent={setContent} /> */}
        {/* <Editor
          initialValue={formData.setupinstructions}
          onChange={setContent}
        /> */}
      </div>
      <ImageUpload onImageUpload={handleImageUpload} />
      {formData.image && (
        <img
          src={formData.image}
          alt='Project'
          className='mt-2 max-w-xs max-h-40 rounded-md '
        />
      )}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='details.framework'>Framework</Label>
          <Input
            type='text'
            name='details.framework'
            id='details.framework'
            value={formData.details.framework}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor='details.useCase'>Use Case</Label>
          <Input
            type='text'
            name='details.useCase'
            id='details.useCase'
            value={formData.details.useCase}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor='details.css'>CSS</Label>
          <Input
            type='text'
            name='details.css'
            id='details.css'
            value={formData.details.css}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor='details.deployment'>Deployment</Label>
          <Input
            type='text'
            name='details.deployment'
            id='details.deployment'
            value={formData.details.deployment}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor='techStack'>Tech Stack (comma-separated)</Label>
        <Input
          type='text'
          name='techStack'
          id='techStack'
          value={formData.techStack}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor='link'>Link</Label>
        <Input
          type='url'
          name='link'
          id='link'
          value={formData.link}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor='github'>GitHub URL</Label>
        <Input
          type='url'
          name='github'
          id='github'
          value={formData.github}
          onChange={handleChange}
        />
      </div>
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
      <Button type='submit' variant='default' className='!bg-purple-500'>
        Update Project
      </Button>
    </form>
  )
}
