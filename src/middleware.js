import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Define the public and protected paths
  const isPublicPath = path === "/admin";
  const isProtectedPath =
    path.startsWith("/admin/dashboard") ||
    path.startsWith("/admin/projects") ||
    path.startsWith("/admin/users");

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;
  const hasToken = !!token;

  // Case 1: User is logged in (has token) but trying to access login page
  // Redirect to dashboard
  if (isPublicPath && hasToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Case 2: User is not logged in (no token) but trying to access protected pages
  // Redirect to login page
  if (isProtectedPath && !hasToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Allow the request to proceed normally in all other cases
  return NextResponse.next();
}

// Configure the paths that this middleware should run on
export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/projects/:path*",
    "/admin/users/:path*",
  ],
};
