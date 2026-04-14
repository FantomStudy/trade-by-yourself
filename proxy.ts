import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = (req: NextRequest) => {
  const sessionId = req.cookies.get("session_id")?.value;
  if (sessionId) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("auth", "");
  return NextResponse.redirect(url);
};

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
