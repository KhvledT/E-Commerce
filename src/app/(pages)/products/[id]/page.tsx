"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { SingleProductResponse } from "@/types/responses";
import { apiServices } from "@/Services/api";
import toast from "react-hot-toast";
import { CartContext, CartContextType } from "@/contexts/cartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { setCartCount, cartCount } = useContext(CartContext) as CartContextType;

  async function getProductDetails() {
    setLoading(true);
    const response : SingleProductResponse = await apiServices.getProduct(id ?? "");
    setProduct(response.data);
    setLoading(false);
  }

  async function toggleWishlist(productId: string) {
    if (!session?.user?.token) {
      toast.error("Please login to manage your wishlist", {
        position: "top-left",
      });
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        const response = await apiServices.removeFromWishlistApi(productId, session.user.token);
        toast.success("Removed from wishlist", {
          position: "top-left",
        });
        setIsInWishlist(false);
      } else {
        const response = await apiServices.addToWishlistApi(productId, session.user.token);
        toast.success("Added to wishlist", {
          position: "top-left",
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      toast.error(isInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist", {
        position: "top-left",
      });
    } finally {
      setWishlistLoading(false);
    }
  }

  useEffect(() => {
    getProductDetails();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!session?.user?.token || !product) return;
      
      try {
        const wishlistResponse = await apiServices.getWishlistApi(session.user.token);
        const isProductInWishlist = wishlistResponse.data.some(
          (item: { _id: string }) => item._id === product._id
        );
        setIsInWishlist(isProductInWishlist);
      } catch (error) {
      }
    };

    checkWishlistStatus();
  }, [session, id]);

  useEffect(() => {
    const handleLoginCallback = async () => {
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
    };

    handleLoginCallback();
  }, [session, setCartCount, cartCount]);
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
      setCartCount(cartCount + 1);
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setCartLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] ?? product.imageCover}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            <Link
              href={``}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.brand.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="ml-2 text-sm text-muted-foreground">
                {product.ratingsQuantity} ({"1000"} reviews)
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{product.sold} sold</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/categories/${product.category.slug}`}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {product.category.name}
            </Link>
            {product.subcategory.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {sub.name}
              </span>
            ))}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            <span
              className={`text-sm ${
                product.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={product.quantity === 0 || cartLoading}
              onClick={() => {
                addToCart(product._id)
              }}
            >
              {cartLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => toggleWishlist(product._id)}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over {formatPrice(50)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  100% secure checkout
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
