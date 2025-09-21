'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { apiServices } from '@/Services/api'
import { 
  UpdateUserData, 
  ChangePasswordData, 
  Order, 
  UpdateUserResponse,
  ChangePasswordResponse, 
  UpdateUserResponseData
} from '@/interfaces'
import { Eye, EyeOff } from 'lucide-react'
import { 
  UserAddress, 
  AddressResponse, 
  AddressFormData 
} from '@/interfaces/shipping'
import { LoadingSpinner } from '@/components/shared'
import { CartContext, CartContextType } from '@/contexts/cartContext';


export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { cartOwner, setCartOwner } = useContext(CartContext) as CartContextType;

  const [userProfile, setUserProfile] = useState< UpdateUserResponseData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  
  
  const [profileForm, setProfileForm] = useState<UpdateUserData>({
    name: undefined,
    email: undefined,
  })
  
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [logoutCountdown, setLogoutCountdown] = useState<number | null>(null)
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null)

  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    name: '',
    details: '',
    phone: '',
    city: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }
    
    if (status === 'authenticated' && session?.user) {

      if(!cartOwner){
        setCartOwner(localStorage.getItem('cartOwner')!)
      }
      
      loadUserProfile()
      loadUserOrders()
      loadUserAddresses()
    }
  }, [status, session, router])

  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [countdownInterval])

  

  const loadUserProfile = async () => {
    if (!session?.user) return
    
    setLoading(true)
    try {
      const userData = session.user
      setUserProfile({
        name: userData.name || '',
        email: userData.email || '',
      })
      
      setProfileForm({
        name: userData.name || '',
        email: userData.email || '',
      })  
    } catch (error) {
      console.error('Error loading user profile:', error)
      setMessage({ type: 'error', text: 'Failed to load user profile' })
    } finally {
      setLoading(false)
    }
  }

  const loadUserOrders = async () => {
    if (!cartOwner || !localStorage.getItem('cartOwner')){
      return
    }
    setOrdersLoading(true)
    try {
      const response = await apiServices.getUserOrdersApi(cartOwner || localStorage.getItem('cartOwner')!)
        let ordersData: Order[] = []
        
        if (Array.isArray(response)) {
          ordersData = response
        } else if (response.data && Array.isArray(response.data)) {
          ordersData = response.data
        } else if (response.orders && Array.isArray(response.orders)) {
          ordersData = response.orders
        }
        
        setOrders(ordersData)

    } catch (error) {
      console.error('Error loading orders:', error)
      setMessage({ type: 'error', text: 'Failed to load orders. Please ensure you have the correct user ID.' })
      setOrders([]) 

    } finally {
      setOrdersLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token) return
    
    setUpdating(true)
    try {
      const hasChanges = profileForm.name !== (session.user.name || undefined) ||
                        profileForm.email !== (session.user.email || undefined)
      
      if (!hasChanges) {
        setMessage({ type: 'error', text: 'No changes made' })
        setUpdating(false)
        return
      }
      
      const updateData = {
        name: profileForm.name === session.user.name ? undefined : profileForm.name,
        email: profileForm.email === session.user.email ? undefined : profileForm.email,
      }
      
      const response: UpdateUserResponse = await apiServices.updateLoggedUserDataApi(
        updateData.name,
        updateData.email,
        session.user.token
      )
      
      if (response.message === 'success') {
        setUserProfile({
          name: response.user.name,
          email: response.user.email,
        })
        setMessage({ type: 'success', text: 'Profile updated successfully! You will be logged out in 3 seconds to re-login.' })
        setIsEditingProfile(false)
        
        setLogoutCountdown(3)
        
        const interval = setInterval(() => {
          setLogoutCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(interval)
              setCountdownInterval(null)
              return null
            }
            return prev - 1
          })
        }, 1000)
        setCountdownInterval(interval)
        
        setTimeout(async () => {
          try {
            await signOut({ redirect: false })
            window.location.reload()
          } catch (error) {
            window.location.reload()
          }
        }, 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile, please try again' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile, please try again' })
    } finally {
      setUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token) return
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }
    
    setChangingPassword(true)
    try {
      const response: ChangePasswordResponse = await apiServices.changePasswordApi(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword,
        session.user.token
      )
      
        if (response.message === 'success') {
        setMessage({ type: 'success', text: 'Password changed successfully! You will be logged out in 3 seconds to re-login.' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
        
        setLogoutCountdown(3)
        
        const interval = setInterval(() => {
          setLogoutCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(interval)
              setCountdownInterval(null)
              return null
            }
            return prev - 1
          })
        }, 1000)
        setCountdownInterval(interval)
        
        setTimeout(async () => {
          try {
            await signOut({ redirect: false })
            window.location.reload()
          } catch (error) {
            window.location.reload()
          }
        }, 3000)
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to change password' })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setChangingPassword(false)
    }
  }

  const loadUserAddresses = async () => {
    if (!session?.user?.token) return
    
    setAddressLoading(true)
    try {
      const response: AddressResponse = await apiServices.getUserAddressesApi(session.user.token)
      if (response.status === 'success') {
        setAddresses(response.data || [])
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      setMessage({ type: 'error', text: 'Failed to load addresses' })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token) return
    
    setAddressLoading(true)
    try {
      const response = await apiServices.addUserAddressApi(addressForm, session.user.token)
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Address added successfully!' })
        setAddressForm({ name: '', details: '', phone: '', city: '' })
        setIsAddingAddress(false)
        loadUserAddresses() // Reload addresses
      } else {
        setMessage({ type: 'error', text: 'Failed to add address' })
      }
    } catch (error) {
      console.error('Error adding address:', error)
      setMessage({ type: 'error', text: 'Failed to add address' })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token || !editingAddressId) return
    
    setAddressLoading(true)
    try {
      await apiServices.removeUserAddressApi(editingAddressId, session.user.token)
      
      const response = await apiServices.addUserAddressApi(addressForm, session.user.token)
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Address updated successfully!' })
        setAddressForm({ name: '', details: '', phone: '', city: '' })
        setIsEditingAddress(false)
        setEditingAddressId(null)
        loadUserAddresses() // Reload addresses
      } else {
        setMessage({ type: 'error', text: 'Failed to update address' })
      }
    } catch (error) {
      console.error('Error updating address:', error)
      setMessage({ type: 'error', text: 'Failed to update address' })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!session?.user?.token) return
    
    setAddressLoading(true)
    try {
      const response = await apiServices.removeUserAddressApi(addressId, session.user.token)
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Address deleted successfully!' })
        loadUserAddresses() // Reload addresses
      } else {
        setMessage({ type: 'error', text: 'Failed to delete address' })
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      setMessage({ type: 'error', text: 'Failed to delete address' })
    } finally {
      setAddressLoading(false)
    }
  }

  const startEditingAddress = (address: UserAddress) => {
    setEditingAddressId(address._id)
    setAddressForm({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    })
    setIsEditingAddress(true)
    setIsAddingAddress(false)
  }

  const cancelEditing = () => {
    setIsEditingAddress(false)
    setIsAddingAddress(false)
    setEditingAddressId(null)
    setAddressForm({ name: '', details: '', phone: '', city: '' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mb-4 lg:mb-6 shadow-lg">
            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl pb-2 lg:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 lg:mb-4">
            My Profile
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Manage your account settings, addresses, and view your order history
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-6 rounded-xl shadow-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-500' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-700'
          }`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                message.type === 'success' ? 'bg-gray-100' : 'bg-gray-200'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{message.text}</p>
                {logoutCountdown !== null && (
                  <p className="text-sm mt-1 font-bold">
                    Logging out in {logoutCountdown} seconds...
                  </p>
                )}
              </div>
              <button 
                onClick={() => setMessage(null)}
                className="ml-4 px-3 py-1 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-lg sm:text-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto text-sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={updating} 
                      className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-black text-white font-semibold py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      {updating ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </div>
                      ) : 'Update Profile'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <Label className="text-xs sm:text-sm font-semibold text-gray-500 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name
                      </Label>
                      <p className="text-sm sm:text-lg font-medium text-gray-900 mt-1 break-words">{userProfile?.name || 'Not provided'}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <Label className="text-xs sm:text-sm font-semibold text-gray-500 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address
                      </Label>
                      <p className="text-sm sm:text-lg font-medium text-gray-900 mt-1 break-all">{userProfile?.email || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
          </Card>

            {/* Change Password */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-lg sm:text-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto text-sm"
                    onClick={() => {
                      setIsChangingPassword(!isChangingPassword)
                      if (isChangingPassword) {
                        // Reset password visibility states when cancelling
                        setShowCurrentPassword(false)
                        setShowNewPassword(false)
                        setShowConfirmPassword(false)
                      }
                    }}
                  >
                    {isChangingPassword ? 'Cancel' : 'Change'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isChangingPassword ? (
                  <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-xs sm:text-sm font-semibold text-gray-700">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-xs sm:text-sm font-semibold text-gray-700">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-gray-700">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={changingPassword} 
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      {changingPassword ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing...
                        </div>
                      ) : 'Change Password'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Click &quot;Change&quot; to update your password</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Ensure your account security with a strong password</p>
                  </div>
                )}
              </CardContent>
          </Card>

            {/* Address Management Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-t-lg">
                <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-lg sm:text-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    My Addresses
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto text-sm"
                    onClick={() => {
                      setIsAddingAddress(true)
                      setIsEditingAddress(false)
                      setAddressForm({ name: '', details: '', phone: '', city: '' })
                    }}
                    disabled={isAddingAddress || isEditingAddress}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Address
                  </Button>
                </CardTitle>
              </CardHeader>
            <CardContent>
              {addressLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 pt-4">
                  {/* Add/Edit Address Form */}
                  {(isAddingAddress || isEditingAddress) && (
                    <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg text-gray-800 flex items-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {isEditingAddress ? 'Edit Address' : 'Add New Address'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <form onSubmit={isEditingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">Address Name</Label>
                              <Input
                                id="name"
                                type="text"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                placeholder="e.g., Home, Office, etc."
                                className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-gray-700">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                placeholder="Phone number"
                                className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="details" className="text-xs sm:text-sm font-semibold text-gray-700">Address Details</Label>
                            <Input
                              id="details"
                              type="text"
                              value={addressForm.details}
                              onChange={(e) => setAddressForm({ ...addressForm, details: e.target.value })}
                              placeholder="Street address, building, apartment..."
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-xs sm:text-sm font-semibold text-gray-700">City</Label>
                            <Input
                              id="city"
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              placeholder="City"
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm"
                              required
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button 
                              type="submit" 
                              disabled={addressLoading}
                              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                            >
                              {addressLoading ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </div>
                              ) : (isEditingAddress ? 'Update Address' : 'Add Address')}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={cancelEditing}
                              className="px-4 sm:px-6 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Addresses List */}
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">No addresses found</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Add your first address above to get started</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:gap-4">
                      {addresses.map((address) => (
                        <Card key={address._id} className="border-l-4 border-l-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-gray-50 to-gray-100">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                              <div className="flex-1 w-full sm:w-auto">
                                <div className="flex items-center mb-2 sm:mb-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight">{address.name}</h3>
                                </div>
                                <div className="space-y-1 sm:space-y-2 text-gray-700">
                                  <p className="flex items-start sm:items-center text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 mt-0.5 sm:mt-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="break-words">{address.details}</span>
                                  </p>
                                  <p className="flex items-center text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {address.phone}
                                  </p>
                                  <p className="flex items-center text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {address.city}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditingAddress(address)}
                                  disabled={isAddingAddress || isEditingAddress}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address._id)}
                                  disabled={addressLoading}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white rounded-t-lg">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-lg sm:text-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Latest Order
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4 py-2"
                      onClick={() => router.push('/viewOrders')}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View All Orders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4 py-2"
                      onClick={loadUserOrders}
                      disabled={ordersLoading}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {ordersLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <LoadingSpinner />
                      <p className="text-gray-500 mt-4">Loading your orders...</p>
                    </div>
                  </div>
                ) : !Array.isArray(orders) || orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">You haven&apos;t placed any orders yet</p>
                    <Button 
                      className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                      onClick={() => router.push('/products')}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Show only the latest order (last in the array) */}
                    {(() => {
                      const latestOrder = orders[orders.length - 1];
                      return (
                      <Card key={latestOrder._id} className="border-l-4 border-l-black shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-gray-50 to-gray-100">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-6">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 truncate">Order #{latestOrder._id.slice(-8)}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    Placed on {formatDate(latestOrder.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                              <p className="font-bold text-xl sm:text-2xl text-gray-900 mb-2">
                                {formatPrice(latestOrder.totalOrderPrice)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                  latestOrder.isPaid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {latestOrder.isPaid ? '✓ Paid' : '⏳ Pending'}
                                </span>
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                  latestOrder.isDelivered 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {latestOrder.isDelivered ? '✓ Delivered' : '📦 Processing'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4 sm:my-6" />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-gray-900 flex items-center text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Shipping Address
                              </h4>
                              <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                                <p className="font-medium break-words">{latestOrder.shippingAddress.details}</p>
                                <p>{latestOrder.shippingAddress.city}</p>
                                <p>{latestOrder.shippingAddress.phone}</p>
                              </div>
                            </div>
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-gray-900 flex items-center text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Payment Method
                              </h4>
                              <div className="text-xs sm:text-sm text-gray-700">
                                <p className="font-medium capitalize">
                                  {latestOrder.paymentMethodType}
                                </p>
                                {latestOrder.paidAt && (
                                  <p className="text-gray-500 mt-1">
                                    Paid on {formatDate(latestOrder.paidAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4 sm:my-6" />

                          <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center text-sm sm:text-base">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              Order Items ({latestOrder.cartItems.length})
                            </h4>
                            {latestOrder.cartItems.length === 0 ? (
                              <div className="text-center py-6 sm:py-8">
                                <p className="text-gray-500 italic text-sm sm:text-base">No items in this order</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {latestOrder.cartItems.map((item) => (
                                  <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                                    <div className="relative flex-shrink-0">
                                      <img
                                        src={item.product.imageCover}
                                        alt={item.product.title}
                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                                        }}
                                      />
                                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                        {item.count}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                                      <h5 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{item.product.title}</h5>
                                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                        <span>Brand: <span className="font-medium">{item.product.brand.name}</span></span>
                                        <span>Category: <span className="font-medium">{item.product.category.name}</span></span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Unit Price: <span className="font-medium">{formatPrice(item.price)}</span>
                                      </p>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto">
                                      <p className="font-bold text-base sm:text-lg text-gray-900">
                                        {formatPrice(item.count * item.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
