'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [profilePicture, setProfilePicture] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
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
        if (!response.ok) {
          throw new Error('Failed to upload image')
        }
        const data = await response.json()
        imageUrl = data.secure_url
      }

      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, profilePicture: imageUrl }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user information')
      }
      const result = await res.json()
      await update(result.user)

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      })
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Update Failed',
        description:
          error.message || 'An error occurred while updating your profile.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Settings</h1>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Change your profile settings here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex justify-center mb-6'>
              <Avatar className='w-24 h-24'>
                <AvatarImage
                  src={session?.user?.profilePicture}
                  alt={session?.user?.name}
                />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter your name'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='profilePicture'>Profile Picture</Label>
              <Input
                id='profilePicture'
                type='file'
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                accept='image/*'
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
