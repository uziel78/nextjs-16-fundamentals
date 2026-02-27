import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// This file is a Next.js middleware that checks if the user has a valid session cookie before allowing access to certain routes. If the user does not have a valid session cookie, they will be redirected to the home page ("/"). If they do have a valid session cookie, they will be allowed to proceed to the requested route. This is a common pattern for protecting routes that require authentication in a Next.js application.
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// The config object is used to specify which routes the middleware should apply to. In this case, we are applying the middleware to all routes under "/dashboard". You can adjust this to fit your application's routing structure and the routes you want to protect with authentication.
export const config = {
  matcher: ['/blog', '/create'], // Specify the routes the middleware applies to
};
