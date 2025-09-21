"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { 
  Tag, 
  Calendar, 
  ArrowLeft,
  ExternalLink,
  Globe,
  Award,
  Package,
} from "lucide-react";
import Link from "next/link";
import { SingleCategoryResponse } from "@/types";
import { apiServices } from "@/Services/api";


export default function CategoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function getCategoryDetails() {
    setLoading(true);
    const response : SingleCategoryResponse = await apiServices.getCategory(id ?? "");
    setCategory(response.data);
    setLoading(false);
  }

  useEffect(() => {
      getCategoryDetails();

  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Category not found"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button asChild>
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/categories" className="hover:text-primary transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gray-50 rounded-2xl"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Category Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Tag className="h-24 w-24 text-primary/60" />
                </div>
              )}
            </div>
          </div>

          {/* Category Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Category Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Tag className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-black py-3 bg-clip-text text-transparent">
                  {category.name}
                </h1>
              </div>
              
              {/* Category Slug */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {category.slug}
                </span>
              </div>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {category.createdAt ? new Date(category.createdAt).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">About {category.name}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Discover amazing products in the {category.name} category. We offer a carefully 
                curated selection of high-quality items that meet your needs and exceed your expectations. 
                From everyday essentials to premium selections, find everything you're looking for.
              </p>
            </div>

            {/* Category Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-sm px-8" asChild>
                <Link href={`/products?category=${category._id}`}>
                  <Package className="h-5 w-5 mr-2" />
                  View All Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-sm px-8" asChild>
                <Link href="/categories">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Browse All Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Wide Selection</h4>
              <p className="text-sm text-blue-700">
                <span className="font-bold">+10</span> products
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Quality Assured</h4>
              <p className="text-sm text-green-700">
                Carefully curated products
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Easy Navigation</h4>
              <p className="text-sm text-purple-700">
                Find what you need quickly
              </p>
            </div>
          </div>
        </div>
      </div>

   
      {/* Additional Info */}
      <div className="bg-muted/50 rounded-xl p-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Category Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category ID:</span>
                <span className="font-mono">{category._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug:</span>
                <span className="font-mono">{category.slug}</span>
              </div>
              {category.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {category.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(category.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/products`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/categories">
                  <Tag className="h-4 w-4 mr-2" />
                  View All Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
