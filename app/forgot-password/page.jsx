'use client'

import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState('email')
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStep('otp')
        toast({
          title: 'OTP Sent',
          description: 'Please check your email for the OTP.',
        })
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      if (res.ok) {
        setStep('newPassword')
        toast({
          title: 'OTP Verified',
          description: 'Please enter your new password.',
        })
      } else {
        throw new Error('Invalid OTP')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      if (res.ok) {
        toast({
          title: 'Password Reset',
          description: 'Your password has been successfully reset.',
        })
        router.push('/login')
      } else {
        throw new Error('Failed to reset password')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleSendOTP}>
              <div className='grid w-full items-center gap-4'>
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
              </div>
              <CardFooter className='flex p-0 mt-4 justify-between'>
                <Button type='submit'>Send OTP</Button>
              </CardFooter>
            </form>
          )}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div className='grid w-full items-center gap-4'>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='otp'>OTP</Label>
                  <Input
                    id='otp'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
              <CardFooter className='flex p-0 mt-4 justify-between'>
                <Button type='submit'>Verify OTP</Button>
              </CardFooter>
            </form>
          )}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword}>
              <div className='grid w-full items-center gap-4'>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='newPassword'>New Password</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <CardFooter className='flex justify-between'>
                <Button type='submit'>Reset Password</Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
