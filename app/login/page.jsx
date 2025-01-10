'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      login,
      password,
    })

    if (result?.error) {
      console.error(result.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='login'>Email or Username</Label>
                <Input
                  id='login'
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
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
            </div>
            <CardFooter className='flex flex-col justify-between items-stretch p-0 mt-4'>
              <div className='flex justify-between'>
                <Button type='submit'>Login</Button>
                <Link
                  href='/forgot-password'
                  className='text-sm text-blue-500 hover:underline'
                >
                  Forgot Password?
                </Link>
              </div>
              <Link
                href='/signup'
                className='text-sm mt-6 text-blue-500 hover:underline'
              >
                Don't have an account?
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
