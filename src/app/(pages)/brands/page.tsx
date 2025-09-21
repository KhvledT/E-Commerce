"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/interfaces";
import { BrandCard } from "@/components/brands";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Grid, List, Building2 } from "lucide-react";
import { apiServices } from "@/Services/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  

  async function getBrands() {
    setLoading(true);
      const response = await apiServices.getBrands();
    setBrands(response.data);
    setLoading(false);
  }

  useEffect(() => {
    getBrands();
  }, []);


  if (loading && brands.length === 0) {
    return <LoadingSpinner />;
  }

  if (error || !brands) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Failed to fetch brands"}</p>
          <Button onClick={getBrands}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl pb-2 sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Brands
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover amazing brands and their exclusive collections
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 lg:mb-12 justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-primary">{brands.length}</span> brands available
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none border-r border-gray-300 px-3 sm:px-4"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none px-3 sm:px-4"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>


      {/* Brands Grid */}
      {brands.length > 0 ? (
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {brands.map((brand) => (
            <BrandCard key={brand._id} brand={brand} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground mb-4">
              No brands available at the moment
            </p>
        </div>
      )}
      </div>
    </div>
  );
}
