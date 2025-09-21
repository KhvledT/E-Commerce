"use client";

import { CartProduct, Product } from "@/interfaces/cart";
import { formatPrice } from "@/helpers/currency";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface CartItemProps {
  item: CartProduct<Product>;
  onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
  handleRemove: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}

export function CartItem({ item, onQuantityChange, handleRemove, isUpdating }: CartItemProps) {
  const deleteRefId = useRef("");
  const [productCount, setproductCount] = useState(item.count)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  useEffect(() => {
    setproductCount(item.count);
  }, [item.count]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  function handleQuantityChange(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    
    setproductCount(newQuantity);
    clearTimeout(timeoutId!);
    
    const Id = setTimeout(() => {
      onQuantityChange(itemId, newQuantity);
    }, 500);
    setTimeoutId(Id);
  }


  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden p-4 space-y-4">
        {/* Top Row: Image and Delete Button */}
        <div className="flex items-start justify-between">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={item.product.imageCover}
              alt={item.product.title}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {productCount}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            onClick={() => {
              handleRemove(item.product._id);
              deleteRefId.current = item.product._id;
            }}
            disabled={isUpdating && deleteRefId.current === item.product._id}
          >
            {isUpdating && deleteRefId.current === item.product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base text-gray-900 leading-tight">
            {item.product.title}
          </h3>
          <p className="text-sm text-gray-600">
            Brand: <span className="font-medium">{item.product.brand.name}</span>
          </p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Quantity:</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => {
                handleQuantityChange(item.product._id, productCount - 1);
              }}
              disabled={productCount <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-8 text-center font-semibold text-base text-gray-900">
              {productCount}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => {
                handleQuantityChange(item.product._id, productCount + 1);
              }}
              disabled={productCount >= item.product.quantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-6 p-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {productCount}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {item.product.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Brand: <span className="font-medium">{item.product.brand.name}</span>
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            onClick={() => {
              handleQuantityChange(item.product._id, productCount - 1);
            }}
            disabled={productCount <= 1}
          >
             <Minus className="h-4 w-4" />
          </Button>
          
          <span className="w-12 text-center font-semibold text-lg text-gray-900">
            {productCount}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            onClick={() => {
              handleQuantityChange(item.product._id, productCount + 1);
            }}
            disabled={productCount >= item.product.quantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          onClick={() => {
            handleRemove(item.product._id);
            deleteRefId.current = item.product._id;
          }}
          disabled={isUpdating && deleteRefId.current === item.product._id}
        >
          {isUpdating && deleteRefId.current === item.product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
