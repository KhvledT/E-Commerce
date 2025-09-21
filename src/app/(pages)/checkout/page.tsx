"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiServices } from '@/Services/api';
import { ShippingAddress, GetCartResponse } from '@/interfaces';
import { UserAddress, AddressResponse, AddressFormData } from '@/interfaces/shipping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditCard, MapPin, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartData, setCartData] = useState<GetCartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    name: '',
    details: '',
    phone: '',
    city: ''
  });

  const form = useForm<ShippingAddress>({
    defaultValues: {
      details: '',
      phone: '',
      city: ''
    }
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.getCartApi(session?.user?.token);
        setCartData(response);
        
        if (response.numOfCartItems === 0) {
          router.push('/cart');
          return;
        }
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError('Failed to load cart data');
      } finally {
        setIsLoading(false);
      }
    };

    const loadUserAddresses = async () => {
      if (!session?.user?.token) return;
      
      setAddressLoading(true);
      try {
        const response: AddressResponse = await apiServices.getUserAddressesApi(session.user.token);
        if (response.status === 'success') {
          setUserAddresses(response.data || []);
          if (response.data && response.data.length > 0) {
            setSelectedAddress(response.data[0]);
            form.setValue('details', response.data[0].details);
            form.setValue('phone', response.data[0].phone);
            form.setValue('city', response.data[0].city);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchCartData();
    loadUserAddresses();
  }, [router, session]);

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    form.setValue('details', address.details);
    form.setValue('phone', address.phone);
    form.setValue('city', address.city);
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token || !editingAddressId) return;
    
    setAddressLoading(true);
    try {
      await apiServices.removeUserAddressApi(editingAddressId, session.user.token);
      
      const response = await apiServices.addUserAddressApi(addressForm, session.user.token);
      if (response.status === 'success') {
        const addressResponse: AddressResponse = await apiServices.getUserAddressesApi(session.user.token);
        if (addressResponse.status === 'success') {
          setUserAddresses(addressResponse.data || []);
          if (selectedAddress?._id === editingAddressId) {
            const updatedAddress = addressResponse.data?.[addressResponse.data.length - 1];
            if (updatedAddress) {
              setSelectedAddress(updatedAddress);
              form.setValue('details', updatedAddress.details);
              form.setValue('phone', updatedAddress.phone);
              form.setValue('city', updatedAddress.city);
            }
          }
        }
        setAddressForm({ name: '', details: '', phone: '', city: '' });
        setIsEditingAddress(false);
        setEditingAddressId(null);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  const startEditingAddress = (address: UserAddress) => {
    setEditingAddressId(address._id);
    setAddressForm({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    });
    setIsEditingAddress(true);
  };

  const cancelEditing = () => {
    setIsEditingAddress(false);
    setEditingAddressId(null);
    setAddressForm({ name: '', details: '', phone: '', city: '' });
  };

  const onSubmit = async (data: ShippingAddress) => {
    if (!cartData?.cartId) {
      setError('No cart found');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await apiServices.createOrderApi(cartData.cartId, data, session?.user?.token);

      if (response.status === 'success' && response.session?.url) {
        window.location.href = response.session.url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cartData || cartData.numOfCartItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mb-6 shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
              Checkout
            </h1>
            <p className="text-lg text-gray-600 mb-8">Your cart is empty</p>
          </div>

          {/* Empty Cart Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Add some products to your cart before proceeding to checkout</p>
              <Link 
                href="/products" 
                className="inline-flex items-center bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mb-4 lg:mb-6 shadow-lg">
            <CreditCard className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 lg:mb-4">
            Checkout
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-6 lg:mb-8 px-4">
            Complete your order with secure payment
          </p>
          <Link 
            href="/cart" 
            className="inline-flex items-center bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 lg:px-6 lg:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Address Sections */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Saved Addresses Section */}
            {userAddresses.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-black rounded-t-xl">
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Select Saved Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {userAddresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedAddress?._id === address._id
                            ? 'border-black bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-2">{address.name}</p>
                            <p className="text-sm text-gray-600 mb-1">{address.details}</p>
                            <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                            <p className="text-sm text-gray-600">{address.city}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingAddress(address);
                              }}
                              disabled={isEditingAddress}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Address Form */}
            {isEditingAddress && (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-2 border-gray-300">
                <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-t-xl">
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Edit Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                  <form onSubmit={handleUpdateAddress} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Address Name</label>
                      <Input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        placeholder="e.g., Home, Office, etc."
                        required
                        className="border-gray-300 focus:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Address Details</label>
                      <Input
                        type="text"
                        value={addressForm.details}
                        onChange={(e) => setAddressForm({ ...addressForm, details: e.target.value })}
                        placeholder="Street address, building, apartment..."
                        required
                        className="border-gray-300 focus:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                      <Input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="Phone number"
                        required
                        className="border-gray-300 focus:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">City</label>
                      <Input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="City"
                        required
                        className="border-gray-300 focus:border-gray-600"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={addressLoading}
                        className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
                      >
                        {addressLoading ? 'Updating...' : 'Update Address'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={cancelEditing}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Shipping Address Form */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-black rounded-t-xl">
                <CardTitle className="text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {userAddresses.length > 0 ? 'Shipping Address' : 'Enter Shipping Address'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="details"
                      rules={{ required: 'Address details are required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Address Details</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full address" 
                              className="border-gray-300 focus:border-gray-600"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{ 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: 'Phone number must be 11 digits'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="01010700999" 
                              className="border-gray-300 focus:border-gray-600"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      rules={{ required: 'City is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Cairo" 
                              className="border-gray-300 focus:border-gray-600"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="text-gray-700 text-sm bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg border border-gray-300">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-fit bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Proceed to Payment
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 sticky top-20">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-black rounded-t-xl">
                <CardTitle className="text-white flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Items ({cartData.numOfCartItems})</span>
                    <span className="font-semibold text-gray-900">{cartData.data.totalCartPrice.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-800">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{cartData.data.totalCartPrice.toFixed(2)} EGP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
