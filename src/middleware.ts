import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const customMiddleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify")
    //   url.pathname.startsWith("/dashboard")
    )
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
};

export { auth, customMiddleware as middleware };

export const config = {
  matcher: ["/signin", "/signup", "/", "/home/:path*", "/verify/:path*"],
};
