"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { 
  Building2, 
  Calendar, 
  ArrowLeft,
  ExternalLink,
  Globe,
  Award,
  Users,
  Package
} from "lucide-react";
import Link from "next/link";
import { Brand } from "@/interfaces";
import { apiServices } from "@/Services/api";

export default function BrandDetailPage() {
  const { id } = useParams();
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getBrandDetails() {
    setLoading(true);
    const response = await apiServices.getBrand(id ?? "");
    setBrand(response.data);
    setLoading(false);
  }

  useEffect(() => {
    if (id) {
      getBrandDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Brand not found"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button asChild>
              <Link href="/brands">View All Brands</Link>
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
        <Link href="/brands" className="hover:text-primary transition-colors">
          Brands
        </Link>
        <span>/</span>
        <span className="text-foreground">{brand.name}</span>
      </div>

      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gray-50 rounded-2xl"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Brand Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>

          {/* Brand Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Brand Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-black py-3 bg-clip-text text-transparent">
                  {brand.name}
                </h1>
              </div>
              
              {/* Brand Slug */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {brand.slug}
                </span>
              </div>
            </div>

            {/* Brand Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {brand.createdAt ? new Date(brand.createdAt).getFullYear() : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Founded</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">Premium</p>
                    <p className="text-sm text-muted-foreground">Quality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Description */}
            <div className="space-y-3">
                <h3 className="text-xl font-semibold">About {brand.name}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {brand.name} is a trusted brand known for quality products and excellent customer service. 
                We are committed to providing the best shopping experience for our customers with carefully 
                curated products that meet the highest standards of quality and innovation.
              </p>
            </div>

            {/* Category Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-sm px-8" asChild>
                <Link href={`/products?brand=${brand._id}`}>
                  <Package className="h-5 w-5 mr-2" />
                  View All Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-sm px-8" asChild>
                <Link href="/brands">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Browse All Brands
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
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Premium Quality</h4>
              <p className="text-sm text-blue-700">
                Carefully selected products
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Trusted Brand</h4>
              <p className="text-sm text-green-700">
                Customer satisfaction guaranteed
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
              <h4 className="font-semibold text-purple-900">Global Reach</h4>
              <p className="text-sm text-purple-700">
                Worldwide shipping available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Brand Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand ID:</span>
                <span className="font-mono">{brand._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug:</span>
                <span className="font-mono">{brand.slug}</span>
              </div>
              {brand.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(brand.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {brand.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(brand.updatedAt).toLocaleDateString()}</span>
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
                <Link href="/brands">
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Brands
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
