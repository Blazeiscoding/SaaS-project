import { clerkMiddleware , createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
])

const isPublicApiRoute = createRouteMatcher([
    "/api/video"
])

export default clerkMiddleware((auth,req)=>{
    const {userId} = auth()
    const currentUrl = new URL(req.url)
    const isHomePage = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isHomePage){
        return NextResponse.redirect(new URL("/home",req.url))
    }

    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRoute(req) && !isApiRequest){
          return NextResponse.redirect(new URL("/sign-in",req.url))  
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
    }

    
}
 return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}