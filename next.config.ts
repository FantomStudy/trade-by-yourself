import type { NextConfig } from "next";

const S3_HOSTNAME = process.env.S3_HOSTNAME;
if (!S3_HOSTNAME) {
  throw new Error("S3_HOSTNAME is not defined in .env");
}

/** Как в instance.ts — без хвостового слэша и кавычек из .env */
function normalizePublicApiUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\/+$/g, "");
  return raw || null;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typedRoutes: true,

  turbopack: {
    root: __dirname,
  },

  // Прокси Engine.IO на бэк: браузер бьёт в тот же origin, что Next (меньше боли с CORS/credentials между портами).
  async rewrites() {
    const api = normalizePublicApiUrl();
    if (!api) return [];
    return [
      { source: "/socket.io", destination: `${api}/socket.io` },
      { source: "/socket.io/:path*", destination: `${api}/socket.io/:path*` },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: S3_HOSTNAME,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
