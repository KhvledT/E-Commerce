"use client";

import { apiServices } from '@/Services/api';
import { CartItem, OrderSummary } from '@/components';
import { CartProduct, CartProductItem} from '@/interfaces/cart';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { CartContext, CartContextType } from '@/contexts/cartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Cart() {
  const { data: session } = useSession();
  const [cartData, setCartData] = useState<CartProduct<CartProductItem>[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { setCartCount, cartCount , setCartOwner } = useContext(CartContext) as CartContextType;



  useEffect(() => {
    const fetchCart = async () => {
        setIsLoading(true);
        const response = await apiServices.getCartApi(session?.user?.token);
        if (response.data) {
          setCartOwner(response.data.cartOwner);
          localStorage.setItem('cartOwner', response.data.cartOwner);
          setCartData(response.data.products);
          setTotalPrice(response.data.totalCartPrice);
        }
        setIsLoading(false);
    }

    if (session?.user?.token) {
      fetchCart();
    }
  }, [session]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

      const cartItem = cartData.find(item => item.product._id === itemId);
      if (!cartItem) return;

      const response = await apiServices.updateCartItemQuantityApi(itemId, newQuantity, session?.user?.token);
      if (response.status === "success" && response.data) {
        setCartData(response.data.products);
        setTotalPrice(response.data.totalCartPrice);
      } else {
        toast.error("Failed to update quantity, please try again", {
          position: "top-left",
        });
      }
  };
  const handleRemove = async (itemId: string) => {
    setIsUpdating(true);
    const response = await apiServices.removeFromCartApi(itemId, session?.user?.token);
    if (response.status === "success") {
      handleRemoveItem(itemId);
      toast.success("Item removed from cart",{
        position: "top-left",
      });
      setCartCount(cartCount - 1);
    }else{
      toast.error("Failed to remove, please try again",{
        position: "top-left",
      });
    }
    setIsUpdating(false);
  };

  const handleClearCart = async () => {
    setIsClearing(true);
      const response = await apiServices.clearCartApi(session?.user?.token);
      if (response.message === "success") {
        setCartData([]);
        setTotalPrice(0);
        toast.success("Cart cleared successfully", {
          position: "top-left",
        });
        setCartCount(0);
      } else {
        toast.error("Failed to clear cart, please try again", {
          position: "top-left",
        });
      }
    setIsClearing(false);
  };


  const handleRemoveItem = (itemId: string) => {
    setCartData(prev => {
      const filtered = prev.filter(item => item.product._id !== itemId);
      const newTotal = filtered.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(newTotal);
      return filtered;
    });
  };

  const itemCount = cartData.reduce((total, item) => total + item.count, 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mb-6 shadow-lg">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl py-4 font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600 mb-8">Your cart is empty</p>
          </div>

          {/* Empty Cart Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Add some products to your cart and they will appear here</p>
              <Link 
                href="/products" 
                className="inline-flex items-center bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
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
            <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 lg:mb-4">
            Shopping Cart
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-6 lg:mb-8">
            {itemCount} items in your cart
          </p>
          {cartData.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isClearing}
              className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 lg:px-6 lg:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
            >
              {isClearing ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Clearing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </div>
              )}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              {cartData.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  handleRemove={handleRemove}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <OrderSummary 
              items={cartData} 
              totalPrice={totalPrice} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}