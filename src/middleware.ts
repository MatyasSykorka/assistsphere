import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that do not require authentication
    const isPublicPath =
        path === "/" ||
        path === "/login" ||
        path === "/register" ||
        path === "/about";

    // Check for the session token cookie
    const sessionToken =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    // If the user is not on a public path and has no session, redirect to login
    if (!isPublicPath && !sessionToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user has role_id 3 (User) is trying to access /tickets
    if (path.startsWith("/tickets")) {
        try {
            const res = await fetch(new URL("/api/auth/get-session", request.url), {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            const session = await res.json();

            if (session?.user?.role_id === 3) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } 
        catch (error) {
            console.error("Error fetching session in middleware", error);
        }
    }

    // Check if user has role_id 2 or 3 (Manager or User) is trying to access /admin_panel
    if (path.startsWith("/admin_panel")) {
        try {
            const res = await fetch(new URL("/api/auth/get-session", request.url), {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            const session = await res.json();

            if (
                session?.user?.role_id === 2 || 
                session?.user?.role_id === 3
            ) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
        catch (error) {
            console.error("Error fetching session in middleware", error);
        }
    }

    // Check if user has role_id 2 or 3 (Manager or User) is trying to access /users
    if (path.startsWith("/users")) {
        try {
            const res = await fetch(new URL("/api/auth/get-session", request.url), {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            const session = await res.json();

            if (
                session?.user?.role_id === 2 || 
                session?.user?.role_id === 3
            ) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } 
        catch (error) {
            console.error("Error fetching session in middleware", error);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match all paths except API, static files, and images
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
