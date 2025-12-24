import { NextResponse } from "next/server";

export default function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("adminToken")?.value;

  console.log(`Middleware: ${pathname}, Token: ${token ? 'exists' : 'none'}`);

  const publicRoutes = [
    "/dashboard",
    "/dashboard/", 
    "/dashboard/Forgot-Password", 
    "/dashboard/Otp-Verification",
    "/dashboard/set-new-password",
    "/dashboard/signup",  
  ];

  // If NO token and trying to access protected routes
  if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
    console.log(`Redirecting to login: ${pathname}`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If token exists and trying to access login page, redirect to dashboard home
  if (token && (pathname === "/dashboard" || pathname === "/dashboard/")) {
    console.log(`Redirecting authenticated user to dashboard home`);
    return NextResponse.redirect(new URL("/dashboard/admin", request.url)); // or whatever your main page is
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

// import { NextResponse } from "next/server";

// export default function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("adminToken")?.value;

//   // Handle /dashboard path - don't redirect it
//   if (pathname === "/dashboard" || pathname === "/dashboard/") {
//     return NextResponse.next();
//   }

//   const publicRoutes = [
//     "/",
//     "/Forgot-Password",
//     "/Otp-Verification",
//     "/set-new-password",
//     "/signup",
//   ];

//   if (!token) {
//     if (!publicRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }

//   // If token exists → allow everything under /admin/*
//   if (token) {
//     if (pathname.startsWith("/admin")) {
//       return NextResponse.next();
//     }
//     // If logged in but trying to access "/" → redirect to /admin
//     if (pathname === "/") {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
//     return NextResponse.next();
//   }

//   // If NO token → allow only "/" (login page)
//   if (!token) {
//     if (pathname !== "/" || !publicRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
// };