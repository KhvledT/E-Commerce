"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { apiServices } from '@/Services/api'
import { LoadingSpinner } from '@/components/shared'

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = getStrength(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-gray-600">
        Password strength: {strengthLabels[strength - 1] || 'Very Weak'}
      </p>
    </div>
  )
}

const emailSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email is too long'),
})

const codeSchema = z.object({
  resetCode: z.string()
    .min(6, 'Reset code must be exactly 6 characters')
    .max(6, 'Reset code must be exactly 6 characters')
    .regex(/^\d+$/, 'Reset code must contain only numbers'),
})

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
})

type EmailFormData = z.infer<typeof emailSchema>
type CodeFormData = z.infer<typeof codeSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      resetCode: '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  })

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiServices.forgotPasswordApi(data.email)
      
      if (response.statusMsg === 'success') {
        setEmail(data.email)
        setStep('code')
      } else {
        setError(response.error || 'Failed to send reset code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onCodeSubmit = async (data: CodeFormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiServices.verifyForgotPasswordApi(data.resetCode)
      
      if (response.status === 'Success') {
        setStep('password')
      } else {
        setError(response.error || 'Invalid reset code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiServices.resetPasswordApi(email, data.password)
      if (response.token) {
        setStep('success')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setError(response.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleBackToEmail = () => {
    setStep('email')
    setError('')
    codeForm.reset()
    passwordForm.reset()
  }

  const handleBackToCode = () => {
    setStep('code')
    setError('')
    passwordForm.reset()
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiServices.forgotPasswordApi(email)
      
      if (response.message) {
        setError('')
      } else {
        setError(response.error || 'Failed to resend code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {step === 'email' && 'Forgot Password'}
              {step === 'code' && 'Verify Reset Code'}
              {step === 'password' && 'Reset Password'}
              {step === 'success' && 'Success!'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {step === 'email' && 'Enter your email address to receive a reset code'}
              {step === 'code' && `We've sent a reset code to ${email}`}
              {step === 'password' && 'Enter your new password'}
              {step === 'success' && 'Your password has been reset successfully! Redirecting to login...'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </div>
            )}

            {step === 'email' && (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            autoComplete="email"
                            autoFocus
                            className="text-sm sm:text-base"
                            suppressHydrationWarning
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full py-2 sm:py-3 text-sm sm:text-base" 
                    disabled={isLoading}
                    suppressHydrationWarning
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : 'Send Reset Code'}
                  </Button>
                </form>
              </Form>
            )}

            {step === 'code' && (
              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={codeForm.control}
                    name="resetCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Reset Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            autoComplete="one-time-code"
                            autoFocus
                            className="text-center text-base sm:text-lg tracking-widest font-mono"
                            suppressHydrationWarning
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '') // Only allow numbers
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full py-2 sm:py-3 text-sm sm:text-base" 
                      disabled={isLoading}
                      suppressHydrationWarning
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : 'Verify Code'}
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 py-2 sm:py-3 text-sm sm:text-base"
                        onClick={handleBackToEmail}
                        disabled={isLoading}
                        suppressHydrationWarning
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 py-2 sm:py-3 text-sm sm:text-base"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        suppressHydrationWarning
                      >
                        Resend Code
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}

            {step === 'password' && (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            autoFocus
                            className="text-sm sm:text-base"
                            suppressHydrationWarning
                            {...field}
                          />
                        </FormControl>
                        <PasswordStrengthIndicator password={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full py-2 sm:py-3 text-sm sm:text-base" 
                      disabled={isLoading}
                      suppressHydrationWarning
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting...
                        </div>
                      ) : 'Reset Password'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full py-2 sm:py-3 text-sm sm:text-base"
                      onClick={handleBackToCode}
                      disabled={isLoading}
                      suppressHydrationWarning
                    >
                      Back to Code Verification
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your password has been reset successfully! You will be redirected to the login page shortly.
                </p>
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full py-2 sm:py-3 text-sm sm:text-base"
                  suppressHydrationWarning
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
