import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const hasAccessToken = request.cookies.has("access_token");

  if (!hasAccessToken) {
    console.log("[Middleware] No tokens found, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile/:path*"],
};
