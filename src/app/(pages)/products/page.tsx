"use client";

import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/interfaces";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Grid, List, Loader2 } from "lucide-react";
import { apiServices } from "@/Services/api";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Error from "@/app/error";
import { CartContext, CartContextType } from "@/contexts/cartContext";

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [paginationLoading, setPaginationLoading] = useState<'previous' | 'next' | null>(null);

const searchParams = useSearchParams();
const categoryId = searchParams.get("category");
const brandId = searchParams.get("brand");
const { setCartCount, cartCount , setCartOwner } = useContext(CartContext) as CartContextType;


  async function getProducts() {
    const response = await apiServices.getProducts(page, limit);
    setProducts(response.data);
  }

  async function getProductsByCategory(categoryId: string) {
    const response = await apiServices.getCategoryProducts(categoryId);
    setProducts(response.data);
  }

  async function getProductsByBrand(brandId: string) {
    const response = await apiServices.getBrandProducts(brandId);
    setProducts(response.data);
  }

  async function getWishlist() {
    if (!session?.user?.token) {
      setWishlistIds([]);
      return;
    }
    
    try {
      const response = await apiServices.getWishlistApi(session.user.token);
      const wishlistProductIds = response.data.map((item: { _id: string }) => item._id);
      setWishlistIds(wishlistProductIds);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistIds([]);
    }
  }

  async function toggleWishlist(productId: string) {
    if (!session?.user?.token) {
      toast.error("Please login to manage your wishlist", {
        position: "top-left",
      });
      return;
    }
    
    const isCurrentlyInWishlist = wishlistIds.includes(productId);
    
    setWishlistLoading(true);
    setWishlistLoadingId(productId);
    
    try {
      if (isCurrentlyInWishlist) {
        const response = await apiServices.removeFromWishlistApi(productId, session.user.token);
        toast.success("Removed from wishlist", {
          position: "top-left",
        });
        setWishlistIds(prev => prev.filter(id => id !== productId));
      } else {
        const response = await apiServices.addToWishlistApi(productId, session.user.token);
        toast.success("Added to wishlist", {
          position: "top-left",
        });
        setWishlistIds(prev => [...prev, productId]);
      }
    } catch (error) {
      toast.error(isCurrentlyInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist", {
        position: "top-left",
      });
    } finally {
      setWishlistLoading(false);
      setWishlistLoadingId(null);
    }
  }

  async function addToCart(productId: string) {
    if (!session?.user?.token) {
      toast.error("Please login to continue order", {
        position: "top-left",
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingCartItem', productId);
        
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      }
      return;
    }

    setCartLoading(true);
    try {
      const response = await apiServices.addToCartApi(productId, session?.user?.token);
      toast.success(response.message,{
        position: "top-left",
      });
      setCartOwner(response.data.cartOwner);
      localStorage.setItem('cartOwner', response.data.cartOwner);
      setCartCount(cartCount + 1);
    } catch (error) {
      toast.error("Failed to add product to cart", {
        position: "top-left",
      });
    } finally {
      setCartLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (categoryId) {
          await getProductsByCategory(categoryId);
        } else if (brandId) {
          await getProductsByBrand(brandId);
        } else {
          await getProducts();
        }
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } finally {
        setLoading(false);
        setPaginationLoading(null);
      }
    };
    
    fetchData();
  }, [page, limit, categoryId, brandId]);

  useEffect(() => {
    getWishlist();
  }, [session]);

  useEffect(() => {
    const handleLoginCallback = async () => {
      if (typeof window !== 'undefined') {
        const pendingCartItem = localStorage.getItem('pendingCartItem');
        if (pendingCartItem && session?.user?.token) {
          try {
            const response = await apiServices.addToCartApi(pendingCartItem, session.user.token);
            toast.success(`Product added to cart: ${response.message}`, {
              position: "top-left",
            });
            setCartCount(cartCount + 1);
            localStorage.removeItem('pendingCartItem');
          } catch (error) {
            toast.error("Failed to add product to cart after login", {
              position: "top-left",
            });
          }
        }
      }
    };

    handleLoginCallback();
  }, [session, setCartCount, cartCount]);

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error error={error} reset={() => {}} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Grid className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl pb-2 sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover amazing products from our carefully curated collection
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 lg:mb-12 justify-between items-center">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-primary">{products.length}</span> products found
            </div>
            {(categoryId || brandId) && (
              <div className="flex flex-wrap gap-2 text-sm">
                {categoryId && (
                  <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                    Category Filter
                  </span>
                )}
                {brandId && (
                  <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                    Brand Filter
                  </span>
                )}
              </div>
            )}
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

      {/* Products Grid */}
      {products.length > 0 ? <div
        className={`grid gap-4 sm:gap-6 ${
          products.length > 0 &&
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {products.length > 0 && products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            viewMode={viewMode} 
            addToCart={addToCart} 
            cartLoading={cartLoading} 
            addToWishlist={toggleWishlist}
            isInWishlist={wishlistIds.includes(product._id)}
            wishlistLoading={wishlistLoading && wishlistLoadingId === product._id}
          />
        ))}
      </div> : <div className="text-center py-10">
        <p className=" text-2xl font-bold">No products found</p>
        <Link href={categoryId ? "/categories" : "/brands"}>
          <Button variant="default" className="mt-4">Browse {categoryId ? "Categories" : "Brands"}</Button>
        </Link>
      </div>}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-2 mt-6 sm:mt-8">
          <Button 
            disabled={page === 1 || paginationLoading !== null} 
            className="w-full sm:w-auto" 
            onClick={() => {
              setPaginationLoading('previous');
              setPage(page - 1);
            }}
          >
            {paginationLoading === 'previous' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ArrowLeft className="w-4 h-4 mr-2" />
            )}
            Previous
          </Button>
          <Button 
            disabled={products.length === 0 || paginationLoading !== null} 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={() => {
              setPaginationLoading('next');
              setPage(page + 1);
            }}
          >
            Next
            {paginationLoading === 'next' ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
