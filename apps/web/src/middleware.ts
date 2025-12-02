import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("bankinho.auth.token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (token && (publicRoutes.includes(pathname) || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}