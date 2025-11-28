import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/profile", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!isProtected) return NextResponse.next();

  const sessionId = req.cookies.get("session_id")?.value;
  if (sessionId) return NextResponse.next();

  // Redirect unauthenticated users to home; optionally trigger auth dialog via query
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("auth", "1");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
