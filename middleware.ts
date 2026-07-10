import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Защищаем только админку
  if (pathname.startsWith("/admin")) {
    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "1");

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
