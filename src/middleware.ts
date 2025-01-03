import {auth} from "@/auth"
import {DEFAULT_LOGIN_DIRECT, apiAuthPrefix, authRoutes, publicRoutes} from "@/routes"; 
import { NextRequest } from "next/server";

export default auth((req)=>{
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if(isApiAuthRoute) {
        return null;
    }

    if(isAuthRoute) {
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_DIRECT, nextUrl))
        }
        return null;
    }

    if(!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }
    return null;
    
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/','/(api|trpc)(.*)']
}