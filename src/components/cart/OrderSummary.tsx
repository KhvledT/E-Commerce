"use client";

import { CartProduct, CartProductItem } from "@/interfaces/cart";
import { formatPrice } from "@/helpers/currency";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Receipt, ShoppingCart } from "lucide-react";

interface OrderSummaryProps {
  items: CartProduct<CartProductItem>[];
  totalPrice: number;
}

export function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const itemCount = items.reduce((total, item) => total + item.count, 0);
  const shipping = 0; 
  const finalTotal = totalPrice + shipping;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border-0 p-4 lg:p-8 shadow-xl">
      <div className="flex items-center mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mr-3">
          <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>
      
      <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
        <div className="flex justify-between text-sm lg:text-base">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between text-sm lg:text-base">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-800 font-semibold">Free</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 lg:pt-4">
          <div className="flex justify-between text-lg lg:text-xl font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4">
        <Button 
          className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold py-3 lg:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
          asChild
        >
          <Link href="/checkout" className="flex items-center justify-center">
            <Receipt className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Proceed to Checkout
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 lg:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
          asChild
        >
          <Link href="/products" className="flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
