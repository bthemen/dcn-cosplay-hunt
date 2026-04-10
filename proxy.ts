import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NEXT.JS 16 DEBUGGING & SECURITY PROXY
 * This function runs before every request defined in the 'config' below.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- CUSTOM DEBUGGING ---
  // This will print in your VS Code / Terminal console
  console.log(`[Proxy Log] Intercepting request to: ${pathname}`);

  // 1. Check if the request is for an API route
  if (pathname.startsWith('/api')) {
    const authToken = request.headers.get('authorization');

    if (!authToken) {
      console.warn(`[Proxy Blocked] Unauthorized API access attempt: ${pathname}`);
      return NextResponse.json(
        { message: 'Security: Authentication Required' },
        { status: 401 }
      );
    }
    
    console.log(`[Proxy Success] Authorized API call: ${pathname}`);
  }

  // 2. Allow the request to continue to your page or API handler
  return NextResponse.next();
}

/**
 * Filter which routes the proxy should watch.
 * Here we watch all API routes and the homepage.
 */
export const config = {
  matcher: ['/api/:path*', '/'],
};