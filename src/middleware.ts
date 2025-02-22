import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if we're on the preferences page
  if (request.nextUrl.pathname === '/preferences') {
    // Check for existing cookie
    const userCookie = request.cookies.get('user_id');
    
    if (!userCookie) {
      // Create a new cookie with 1 week expiration
      const cookieId = nanoid();
      response.cookies.set('user_id', cookieId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }
  }

  return response;
}

export const config = {
  matcher: '/preferences'
}; 