import type { NextConfig } from "next";

function cleanHostname(val?: string): string | null {
  if (!val) return null;
  return (
    val
      .trim()
      .replace(/^['"]+|['"]+$/g, "")
      .replace(/^https?:\/\//, "")
      .replace(/\/+.*$/, "")
      .trim() || null
  );
}

const customS3 = cleanHostname(process.env.S3_HOSTNAME);

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

  // Ускорение сборки на VPS: пропускаем повторный typecheck/eslint во время docker build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "s3.ru1.storage.beget.cloud",
      },
      {
        protocol: "https",
        hostname: "*.storage.beget.cloud",
      },
      {
        protocol: "https",
        hostname: "s3.ru-1.storage.selcloud.ru",
      },
      {
        protocol: "https",
        hostname: "s3.storage.selcloud.ru",
      },
      {
        protocol: "https",
        hostname: "*.storage.selcloud.ru",
      },
      {
        protocol: "https",
        hostname: "*.selcloud.ru",
      },
      {
        protocol: "https",
        hostname: "s3.reg.ru",
      },
      {
        protocol: "https",
        hostname: "*.storage.reg.ru",
      },
      {
        protocol: "https",
        hostname: "*.reg.ru",
      },
      ...(customS3 ? [{ protocol: "https" as const, hostname: customS3 }] : []),
    ],
  },
};

export default nextConfig;
