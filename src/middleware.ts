import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "@auth/core/jwt";
import { DEFAULT_LOGIN_DIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Check if the user is authenticated by verifying the JWT
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET, // Ensure this matches your Auth.js configuration
    // secureCookie: true
  });

  // console.log("Token from middleware:", token);

  const isLoggedIn = !!token;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users trying to access auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_DIRECT, req.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // Match all routes except static files
    "/", // Match the root route
    "/(api|trpc)(.*)", // Match API and TRPC routes
  ],
};