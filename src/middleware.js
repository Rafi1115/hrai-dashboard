// import { NextResponse } from "next/server";

// export default function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("adminToken")?.value;

//   console.log(`Middleware: ${pathname}, Token: ${token ? 'exists' : 'none'}`);

//   const publicRoutes = [
//     "/dashboard",
//     "/dashboard/", 
//     "/dashboard/Forgot-Password", 
//     "/dashboard/Otp-Verification",
//     "/dashboard/set-new-password",
//     "/dashboard/signup",  
//   ];

//   // If NO token and trying to access protected routes
//   if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
//     console.log(`Redirecting to login: ${pathname}`);
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // If token exists and trying to access login page, redirect to dashboard home
//   if (token && (pathname === "/dashboard" || pathname === "/dashboard/")) {
//     console.log(`Redirecting authenticated user to dashboard home`);
//     return NextResponse.redirect(new URL("/dashboard/admin", request.url)); // or whatever your main page is
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("adminToken")?.value;

  const publicRoutes = [
    "/",
    "/Forgot-Password",
    "/Otp-Verification",
    "/set-new-password",
    "/signup",
  ];

  // Allow public routes without token
  if (!token && publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // No token → block admin routes
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Token exists → redirect login page to admin
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Token exists → allow admin routes
  if (token && pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

