"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";



interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  addToCart: (productId: string) => void;
  cartLoading: Record<string, boolean>;
  addToWishlist: (productId: string) => void;
  isInWishlist?: boolean;
  wishlistLoading?: boolean;
}

export function ProductCard({ product, viewMode = "grid", addToCart, cartLoading, addToWishlist, isInWishlist = false, wishlistLoading = false }: ProductCardProps) {

  const handleHeartClick = () => {
    addToWishlist(product._id);
  };
  function handleAddToCart() {
    addToCart(product._id);
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base sm:text-lg leading-tight">
              <Link
                href={`/products/${product._id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHeartClick}
              disabled={wishlistLoading}
              className="ml-2"
            >
              {wishlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {product.sold > 10000 ? "+10000" : product.sold} sold
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.priceAfterDiscount && (
                <span className="text-base sm:text-lg text-muted-foreground line-through">
                  {formatPrice(product.priceAfterDiscount)}
                </span>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>
                  Brand: <Link
                    href={`/brands/${product.brand.slug}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                </span>
                <span>
                  Category: <Link
                    href={`/categories/${product.category.slug}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            </div>

            <Button 
              onClick={handleAddToCart}
              disabled={cartLoading[product._id]}
              className="w-full sm:w-auto"
              >
              {cartLoading[product._id] ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 hover:scale-110"
          onClick={handleHeartClick}
          disabled={wishlistLoading}
        >
          {wishlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 transition-colors ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
          )}
        </Button>

        {/* Popular Badge */}
        {product.sold > 10000 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
            🔥 Popular
          </div>
        )}

       
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand */}
        <div className="mb-2">
          <Link
            href={`/brands/${product.brand.slug}`}
            className="inline-block text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20"
          >
            {product.brand.name}
          </Link>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base mb-3 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          <Link href={`/products/${product._id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(product.ratingsAverage)}</div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.ratingsQuantity})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {product.sold > 10000 ? "+10k" : product.sold} sold
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-primary transition-colors hover:underline"
          >
            📂 {product.category.name}
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 min-h-[3rem]">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.priceAfterDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.priceAfterDiscount)}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Price</div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
          size="sm" 
          onClick={handleAddToCart}
          disabled={cartLoading[product._id]}
        >
          {cartLoading[product._id] ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
