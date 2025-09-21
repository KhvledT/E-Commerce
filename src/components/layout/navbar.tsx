"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Loader2, LogOut, LogIn, Heart, Package, Tag, UserPlus } from "lucide-react";
import { Button } from "@/components";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components";
import { cn } from "@/lib/utils";
import React, { useContext, useState, useEffect, useRef } from "react";
import { CartContext, CartContextType } from "@/contexts/cartContext";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, isLoading } = useContext(CartContext) as CartContextType;
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession()

  // Close mobile menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Handle scroll detection for blur effect on large screens
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navItems = [
    { href: "/products", label: "Products", icon: Package },
    { href: "/brands", label: "Brands", icon: Tag },
    { href: "/categories", label: "Categories", icon: Tag },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-[60] w-full border-b shadow-sm transition-all duration-300",
      // Mobile: always solid background
      "bg-background",
      // Large screens: blur only when scrolled
      "lg:bg-background/95 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-background/60",
      // When not scrolled on large screens, use solid background
      !isScrolled && "lg:bg-background lg:backdrop-blur-none"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group relative">
            <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-bold text-base sm:text-lg transition-transform duration-300 group-hover:scale-110">
                T
              </span>
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text">
              TechMart
            </span>
            <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => {
                const isActive =
                  item.href == "/"
                    ? pathname == "/"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 relative",
                          isActive
                            ? "bg-black text-white shadow-md font-semibold hover:bg-black hover:text-white focus:bg-black focus:text-white"
                            : "bg-background text-muted-foreground hover:text-primary focus:bg-accent focus:text-accent-foreground transition-all duration-300"
                        )}
                      >
                        {!isActive && (
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 hover:w-full"></div>
                        )}
                        <span className="relative z-10">
                          {item.label}
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">

            { session ? <>
              {/* User Account */}
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group">
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="sr-only">Account</span>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-lg z-50">
                    {session.user.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                  </div>
                </Button>
              </Link>

              {/* Shopping Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:scale-110 transition-all duration-300 group">
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-semibold shadow-sm group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : cartCount}
                  </span>
                  <span className="sr-only">Shopping cart</span>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-lg z-50">
                    Cart ({cartCount})
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                  </div>
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={() => signOut()} className="hover:bg-red-500/10 hover:scale-110 transition-all duration-300 group">
                <LogOut className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="sr-only">Logout</span>
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-lg z-50">
                  Logout
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                </div>
              </Button>
              </>
               :
               <>
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 group text-xs sm:text-sm px-2 sm:px-3 ${
                      pathname === '/auth/login' 
                        ? 'bg-black text-white border-black hover:bg-gray-800' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 group text-xs sm:text-sm px-2 sm:px-3 ${
                      pathname === '/auth/register' 
                        ? 'bg-black text-white border-black hover:bg-gray-800' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
            </>}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 hover:scale-110 transition-all duration-300 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 z-50 bg-background border-t shadow-lg animate-in slide-in-from-top-2 duration-300"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/products" &&
                      pathname.startsWith("/products"));

                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium relative hover:bg-accent/50 transition-all duration-300",
                        isActive
                          ? "bg-black text-white shadow-lg font-semibold hover:bg-black hover:text-white focus:bg-black focus:text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {!isActive && (
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 hover:w-full"></div>
                      )}
                      <Icon className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}