import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// const protectedPaths = ["/profile"];

export const proxy = (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const hasAccessToken = request.cookies.has("access_token");

  if (!hasAccessToken) {
    console.log("[Middleware] No tokens found, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile/:path*", "/analytics/:path*", "/new-product/:path*"],
};
