'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
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
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Upload image to Cloudinary
    let imageUrl = ''
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

    // Create user
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, profilePicture: imageUrl }),
    })

    if (res.ok) {
      // Sign in the user
      const result = await signIn('credentials', {
        redirect: false,
        login: email,
        password,
      })

      if (result?.error) {
        console.error(result.error)
      } else {
        router.push('/dashboard')
      }
    } else {
      const data = await res.json()
      console.error(data.error)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
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
                  required
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            <CardFooter className='flex justify-between flex-col items-start p-0 mt-4'>
              <Button type='submit'>Sign Up</Button>
              <Link
                href='/login'
                className='text-sm mt-6 text-blue-500 hover:underline'
              >
                Already have an account? Login
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
