'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrlParam = searchParams.get('callbackUrl') || '/products'
  const callbackUrl = callbackUrlParam.startsWith('http') 
    ? callbackUrlParam 
    : callbackUrlParam.startsWith('/') 
      ? callbackUrlParam 
      : `/${callbackUrlParam}`
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      
      if (response?.ok) {
        router.push(callbackUrl)
      } else {
        setError( 'password or email is incorrect, try again')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">
                T
              </span>
            </div>
            <span className="font-bold text-xl sm:text-2xl">TechMart</span>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 pb-4 sm:pb-6 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-center">Sign in</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {error && (
              <div className="p-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-10 sm:h-11 text-sm sm:text-base"
                          suppressHydrationWarning
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm sm:text-base font-medium">
                          Password
                        </FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-10 sm:h-11 pr-10 text-sm sm:text-base"
                            suppressHydrationWarning
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            suppressHydrationWarning
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <Button 
                  type="submit" 
                  className="w-full h-10 sm:h-11 font-medium text-sm sm:text-base"
                  disabled={isLoading}
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : 'Sign in'}
                </Button>
                {/* forgot password link */}
                <Link 
                  href="/auth/forgotPassword" 
                  className="text-xs sm:text-sm text-black font-medium hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}