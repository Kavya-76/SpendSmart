import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const customMiddleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;
  const path = url.pathname;
  
  // Extract username from /verify/:username
  const usernameMatch = path.match(/^\/verify\/([^/]+)$/);
  const username = usernameMatch ? usernameMatch[1] : null;

  const isPublicPath = path === '/home' || 
                       path === '/signin' || 
                       path === '/signup' || 
                       path === '/verify'

  console.log(token);
  console.log(path);
  console.log(username);
  console.log("Public path:", isPublicPath);

  if (
    token &&
    (path === "/signin" || 
     path === "/signup" || 
     path.startsWith("/verify") || 
     path === "/home")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
};

export { auth, customMiddleware as middleware };

export const config = {
  matcher: ["/signin", "/signup", "/", "/home", "/verify/:path*", '/dashboard/:path*'],
};
