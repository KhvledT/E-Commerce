"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tag, Calendar } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  viewMode?: "grid" | "list";
  productCount?: number;
}

export function CategoryCard({ category, viewMode = "grid", productCount = 0 }: CategoryCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCreatedDate = (dateString: string) => {
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
        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 group/image">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover rounded-md group-hover/image:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 128px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex items-center justify-center">
              <Tag className="h-8 w-8 text-primary" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base sm:text-lg leading-tight">
              <Link
                href={`/categories/${category._id}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            </h3>
            <Button variant="ghost" size="sm" asChild className="ml-2">
              <Link href={`/products?category=${category._id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            {category.createdAt && (
              <span className="text-sm text-muted-foreground">
                Created: {formatCreatedDate(category.createdAt)}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                {category.slug}
              </span>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/products?category=${category._id}`}>
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
      {/* Category Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <Tag className="h-16 w-16 text-primary/60 mx-auto mb-2" />
              <span className="text-xs text-primary/60 font-medium">Category</span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick View Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border border-white/20 hover:scale-110"
          asChild
        >
          <Link href={`/products?category=${category._id}`}>
            <ExternalLink className="h-4 w-4 text-gray-600 hover:text-primary" />
          </Link>
        </Button>

        {/* Popular Badge */}
        {productCount > 50 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
            🔥 Popular
          </div>
        )}

        {/* Category Overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/products?category=${category._id}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-center hover:bg-white cursor-pointer">
              <span className="text-sm font-bold text-gray-900 hover:text-primary transition-colors">Browse Products</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-5">
        {/* Category Name */}
        <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors leading-tight">
          <Link href={`/categories/${category._id}`} className="hover:underline">
            {category.name}
          </Link>
        </h3>

        {/* Category Slug */}
        <div className="mb-4">
          <span className="inline-block text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded-full">
            {category.slug}
          </span>
        </div>

        {/* Stats and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
          </div>
          {category.createdAt && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatCreatedDate(category.createdAt)}</span>
            </div>
          )}
        </div>

        {/* View Products Button */}
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
          size="sm" 
          asChild
        >
          <Link href={`/products?category=${category._id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
