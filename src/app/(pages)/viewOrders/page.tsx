"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { apiServices } from '@/Services/api';
import { Order, UserOrdersResponse } from '@/interfaces';
import { CartContext, CartContextType } from '@/contexts/cartContext';
import { LoadingSpinner } from '@/components/shared';

export default function ViewOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartOwner } = useContext(CartContext) as CartContextType;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user) {
      loadUserOrders();
    }
  }, [status, session, router]);

  const loadUserOrders = async () => {
    const currentCartOwner = cartOwner || localStorage.getItem('cartOwner');
    
    if (!currentCartOwner || !session?.user?.token) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response: UserOrdersResponse = await apiServices.getUserOrdersApi(currentCartOwner, session.user.token);
        let ordersData: Order[] = [];
        
        if (Array.isArray(response)) {
          ordersData = response;
        } else if (response.data && Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.orders && Array.isArray(response.orders)) {
          ordersData = response.orders;
        }
        
        setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
            All Orders
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            View and manage all your order history
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Profile</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl shadow-lg border-l-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-700">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 sm:mr-4 bg-gray-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!Array.isArray(orders) || orders.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12 sm:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No Orders Found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">You haven&apos;t placed any orders yet. Start shopping to see your order history here.</p>
              <Button 
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.slice().reverse().map((order, index) => (
              <Card key={order._id} className={`border-l-4 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                index === 0 ? 'border-l-black' : 'border-l-gray-500'
              }`}>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${
                          index === 0 ? 'bg-gradient-to-br from-black to-gray-800' : 'bg-gradient-to-br from-gray-500 to-gray-700'
                        }`}>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">
                            Order #{order._id.slice(-8)}
                            {index === 0 && (
                              <span className="ml-2 sm:ml-3 px-2 sm:px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                                Latest
                              </span>
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-2xl sm:text-3xl text-gray-900 mb-3">
                        {formatPrice(order.totalOrderPrice)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                          order.isPaid 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                        </span>
                        <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                          order.isDelivered 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {order.isDelivered ? '✓ Delivered' : '📦 Processing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 sm:my-8" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <h4 className="font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Shipping Address
                      </h4>
                      <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{order.shippingAddress.details}</p>
                        <p>{order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <h4 className="font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Method
                      </h4>
                      <div className="text-xs sm:text-sm text-gray-700">
                        <p className="font-medium capitalize">
                          {order.paymentMethodType}
                        </p>
                        {order.paidAt && (
                          <p className="text-gray-500 mt-1">
                            Paid on {formatDate(order.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 sm:my-8" />

                  <div>
                    <h4 className="font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items ({order.cartItems.length})
                    </h4>
                    {order.cartItems.length === 0 ? (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 italic text-sm sm:text-base">No items in this order</p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {order.cartItems.map((item) => (
                          <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-4 sm:gap-6 flex-1">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={item.product.imageCover}
                                  alt={item.product.title}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                  }}
                                />
                                <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                  {item.count}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight" title={item.product.title}>
                                  {item.product.title}
                                </h5>
                                <div className="flex flex-col sm:flex-row sm:gap-6 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                                  <span>Brand: <span className="font-medium">{item.product.brand.name}</span></span>
                                  <span>Category: <span className="font-medium">{item.product.category.name}</span></span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Unit Price: <span className="font-medium">{formatPrice(item.price)}</span>
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="font-bold text-lg sm:text-xl text-gray-900">
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
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-12 flex justify-center">
          <Button
            variant="outline"
            onClick={loadUserOrders}
            disabled={loading}
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">Refreshing...</span>
                <span className="sm:hidden">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh Orders</span>
                <span className="sm:hidden">Refresh</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}