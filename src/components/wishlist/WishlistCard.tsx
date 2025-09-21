"use client";

import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/interfaces/wishList";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Trash2 } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { useRef } from "react";

interface WishlistCardProps {
  item: WishlistItem;
  viewMode?: "grid" | "list";
  addToCart: (productId: string) => void;
  cartLoading: boolean;
  removeFromWishlist: (productId: string) => void;
  removeLoading: boolean;
}

export function WishlistCard({ 
  item, 
  viewMode = "grid", 
  addToCart, 
  cartLoading, 
  removeFromWishlist,
  removeLoading 
}: WishlistCardProps) {
  const gridCartLoadingRef = useRef<string>("");
  const listCartLoadingRef = useRef<string>("");
  const removeLoadingRef = useRef<string>("");

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(item._id);
    removeLoadingRef.current = item._id;
  };

  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={item.imageCover}
            alt={item.title}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">
              <Link
                href={`/products/${item._id}`}
                className="hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRemoveFromWishlist}
                disabled={removeLoading && item._id === removeLoadingRef.current}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                {removeLoading && item._id === removeLoadingRef.current ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {item.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(item.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({item.ratingsQuantity})
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {item.sold > 10000 ? "+10000" : item.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
                {item.priceAfterDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(item.priceAfterDiscount)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{" "}
                  <Link
                    href={`/brands/${item.brand.slug}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {item.brand.name}
                  </Link>
                </span>
                <span>
                  Category:{" "}
                  <Link
                    href={`/categories/${item.category.slug}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {item.category.name}
                  </Link>
                </span>
              </div>
            </div>

            <Button 
              onClick={() => {
                addToCart(item._id);
                listCartLoadingRef.current = item._id;
              }}
              disabled={cartLoading && item._id === listCartLoadingRef.current}
            >
              {cartLoading && item._id === listCartLoadingRef.current ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={item.imageCover}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Remove from Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-red-50 backdrop-blur-sm shadow-lg border border-white/20 hover:scale-110 text-red-500 hover:text-red-700"
          onClick={handleRemoveFromWishlist}
          disabled={removeLoading && item._id === removeLoadingRef.current}
        >
          {removeLoading && item._id === removeLoadingRef.current ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>

        {/* Heart Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
          ❤️ In Wishlist
        </div>

        {/* Popular Badge */}
        {item.sold > 100 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
            🔥 Popular
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="sm" 
            className="w-full bg-white text-primary hover:bg-primary hover:text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            onClick={() => {
              addToCart(item._id);
              gridCartLoadingRef.current = item._id;
            }}
            disabled={cartLoading && item._id === gridCartLoadingRef.current}
          >
            {cartLoading && item._id === gridCartLoadingRef.current ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand */}
        <div className="mb-2">
          <Link
            href={`/brands/${item.brand.slug}`}
            className="inline-block text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20"
          >
            {item.brand.name}
          </Link>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base mb-3 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          <Link href={`/products/${item._id}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(item.ratingsAverage)}</div>
              <span className="text-xs text-gray-500 font-medium">
                ({item.ratingsQuantity})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {item.sold > 10000 ? "+10k" : item.sold} sold
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Link
            href={`/categories/${item.category.slug}`}
            className="text-xs text-gray-500 hover:text-primary transition-colors hover:underline"
          >
            📂 {item.category.name}
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 min-h-[3rem]">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(item.price)}
            </span>
            {item.priceAfterDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(item.priceAfterDiscount)}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Price</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
            size="sm" 
            onClick={() => {
              addToCart(item._id);
              gridCartLoadingRef.current = item._id;
            }}
            disabled={cartLoading && item._id === gridCartLoadingRef.current}
          >
            {cartLoading && item._id === gridCartLoadingRef.current ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
            onClick={handleRemoveFromWishlist}
            disabled={removeLoading && item._id === removeLoadingRef.current}
          >
            {removeLoading && item._id === removeLoadingRef.current ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
