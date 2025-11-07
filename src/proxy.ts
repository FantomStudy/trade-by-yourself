import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// const protectedPaths = ["/profile"];

export const proxy = (request: NextRequest) => {
  return NextResponse.next();
};
// export const proxy = (request: NextRequest) => {
//   const path = request.nextUrl.pathname;

//   const isProtected = protectedPaths.some((p) => path.startsWith(p));

//   if (isProtected) {
//     const hasAccessToken = request.cookies.has("access_token");
//     const hasRefreshToken = request.cookies.has("refresh_token");

//     if (!hasAccessToken && !hasRefreshToken) {
//       console.log("[Middleware] No tokens found, redirecting to /");
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// };

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
//   ],
// };
