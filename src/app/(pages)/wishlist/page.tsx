"use client";

import { WishlistItem } from '@/interfaces/wishList';
import { apiServices } from '@/Services/api';
import { WishlistCard } from '@/components/wishlist';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Heart, Grid, List, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function getWishlist() {
    if (!session?.user?.token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiServices.getWishlistApi(session.user.token);
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId: string) {
    if (!session?.user?.token) {
      toast.error("Please login to continue order", {
        position: "top-left",
      });
      
      localStorage.setItem('pendingCartItem', productId);
      
      const currentUrl = window.location.pathname;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setCartLoading(true);
    try {
      const response = await apiServices.addToCartApi(productId, session?.user?.token);
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setCartLoading(false);
    }
  }

  async function removeFromWishlist(productId: string) {
    if (!session?.user?.token) {
      toast.error("Please login to manage your wishlist", {
        position: "top-left",
      });
      return;
    }
    
    setRemoveLoading(true);
    try {
      const response = await apiServices.removeFromWishlistApi(productId, session.user.token);
      toast.success(response.message, {
        position: "top-left",
      });
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      toast.error("Failed to remove from wishlist", {
        position: "top-left",
      });
    } finally {
      setRemoveLoading(false);
    }
  }

  useEffect(() => {
    getWishlist();
  }, [session]);


  useEffect(() => {
    const handleLoginCallback = async () => {
      const pendingCartItem = localStorage.getItem('pendingCartItem');
      if (pendingCartItem && session?.user?.token) {
        try {
          const response = await apiServices.addToCartApi(pendingCartItem, session.user.token);
          toast.success(`Product added to cart: ${response.message}`, {
            position: "top-left",
          });
          localStorage.removeItem('pendingCartItem');
        } catch (error) {
          toast.error("Failed to add product to cart after login", {
            position: "top-left",
          });
        }
      }
    };

    handleLoginCallback();
  }, [session]);

  if (loading && (!wishlist || wishlist.length === 0)) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {wishlist && wishlist.length > 0 
              ? `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} in your wishlist`
              : 'Your wishlist is empty'
            }
          </p>
        </div>

      {/* Empty State */}
      {wishlist && wishlist.length === 0 && !loading ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start adding products you love to your wishlist. You can save items for later and easily add them to your cart when you're ready to buy.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12 justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-primary">{wishlist?.length || 0}</span> item{(wishlist?.length || 0) === 1 ? '' : 's'} in wishlist
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-r border-gray-300 "
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none "
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1"
            }`}
          >
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                viewMode={viewMode}
                addToCart={addToCart}
                cartLoading={cartLoading}
                removeFromWishlist={removeFromWishlist}
                removeLoading={removeLoading}
              />
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
