import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that do not require authentication
    const isPublicPath = path === "/" || path === "/login" || path === "/register" || path === "/about";

    // Check for the session token cookie
    const sessionToken = 
        request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

    // If the user is not on a public path and has no session, redirect to login
    if (!isPublicPath && !sessionToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Match all paths except API, static files, and images
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
