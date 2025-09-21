import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/cart', 
    '/checkout',
    '/wishlist',
    '/allorders',
    '/viewOrders'
  ]

  // Auth routes that authenticated users shouldn't access
  const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgotPassword'
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (pathname.startsWith('/checkout')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      const callbackUrl = pathname + request.nextUrl.search
      loginUrl.searchParams.set('callbackUrl', callbackUrl)
      return NextResponse.redirect(loginUrl)
    }
    
    const referer = request.headers.get('referer')
    const isFromCart = referer && referer.includes('/cart')
    
    if (!isFromCart) {
      return NextResponse.redirect(new URL('/cart', request.url))
    }
  }

  if (token && isAuthRoute) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    const callbackUrl = pathname + request.nextUrl.search
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/cart',
    '/profile',
    '/checkout',
    '/wishlist', 
    '/allorders',
    '/viewOrders',
    '/auth/login',
    '/auth/register',
    '/auth/forgotPassword'
  ],
}