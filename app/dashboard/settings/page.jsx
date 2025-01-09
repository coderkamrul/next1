'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [profilePicture, setProfilePicture] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = session?.user?.profilePicture

    if (profilePicture) {
      const formData = new FormData()
      formData.append('file', profilePicture)
      formData.append('upload_preset', 'ml_default')
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/ecommerce-tech/raw/upload',
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await response.json()
      imageUrl = data.secure_url
    }

    const res = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, profilePicture: imageUrl }),
    })

    if (res.ok) {
      await update({ name, email, profilePicture: imageUrl })
    } else {
      console.error('Failed to update user information')
    }
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Settings</h1>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='profilePicture'>Profile Picture</Label>
                <Input
                  id='profilePicture'
                  type='file'
                  onChange={(e) =>
                    setProfilePicture(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
            <CardFooter className='flex justify-between'>
              <Button type='submit'>Update Profile</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
