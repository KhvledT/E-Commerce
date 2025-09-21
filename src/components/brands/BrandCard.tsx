"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
  viewMode?: "grid" | "list";
  productCount?: number;
  averageRating?: number;
}

export function BrandCard({ brand, viewMode = "grid", productCount = 0, averageRating = 0 }: BrandCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatFoundedYear = (dateString: string) => {
    if (!mounted) return 'Loading...';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };
  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base sm:text-lg leading-tight">
              <Link
                href={`/brands/${brand._id}`}
                className="hover:text-primary transition-colors"
              >
                {brand.name}
              </Link>
            </h3>
            <Button variant="ghost" size="sm" asChild className="ml-2">
              <Link href={`/products?brand=${brand._id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              <span>Founded: {brand.createdAt ? formatFoundedYear(brand.createdAt) : 'N/A'}</span>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/products?brand=${brand._id}`}>
                View All Products
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
      {/* Brand Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick View Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 hover:scale-110"
          asChild
        >
          <Link href={`/products?brand=${brand._id}`}>
            <ExternalLink className="h-4 w-4 text-gray-600 hover:text-primary" />
          </Link>
        </Button>

        {/* Brand Logo Overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/products?brand=${brand._id}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-center hover:bg-white cursor-pointer">
              <span className="text-sm font-bold text-gray-900 hover:text-primary transition-colors">View Products</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Brand Info */}
      <div className="p-5">
        {/* Brand Name */}
        <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors leading-tight">
          <Link href={`/brands/${brand._id}`} className="hover:underline">
            {brand.name}
          </Link>
        </h3>

        {/* Founded Year */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Founded: {brand.createdAt ? formatFoundedYear(brand.createdAt) : 'N/A'}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-700">{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* View Products Button */}
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
          size="sm" 
          asChild
        >
          <Link href={`/products?brand=${brand._id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
