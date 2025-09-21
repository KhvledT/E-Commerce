"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Shop",
    links: [
      { title: "All Products", href: "/products" },
      { title: "Brands", href: "/brands" },
      { title: "Categories", href: "/categories" },
      { title: "Wishlist", href: "/wishlist" },
      { title: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "My Profile", href: "/profile" },
      { title: "My Orders", href: "/viewOrders" },
      { title: "All Orders", href: "/allorders" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Contact Us", href: "/contact" },
      { title: "Help Center", href: "/help" },
      { title: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About TechMart", href: "/about" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                  T
                </span>
              </div>
              <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                TechMart
              </span>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md leading-relaxed">
              Your one-stop destination for the latest technology, fashion, and
              lifestyle products. Quality guaranteed with fast shipping and
              excellent customer service.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span className="break-words">123 Tech Street, Digital City, DC 12345</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span className="break-all">support@techmart.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2 sm:space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3 sm:space-y-4 lg:space-y-5">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-12" />
        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 sm:space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Stay Updated</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto lg:mx-0">
                Subscribe to our newsletter for the latest deals and updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md lg:max-w-none space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-input bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
              />
              <Button type="submit" className="px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm sm:text-base w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 sm:my-10 lg:my-12" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 text-xs sm:text-sm text-muted-foreground">
          <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-6 text-center lg:text-left">
            <p className="font-medium">&copy; 2024 TechMart. All rights reserved.</p>
            <div className="hidden lg:block w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Cookies
              </Link>
              <Link
                href="/about"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-foreground transition-colors hover:underline underline-offset-4"
            >
              Next.js
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
