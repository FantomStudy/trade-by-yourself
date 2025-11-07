import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typedRoutes: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
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
    ],
  },
  // rewrites: () => [
  //   {
  //     source: "/api/:path*",
  //     destination: `${BACKEND_API_URL}/api/:path*`,
  //   },
  // ],
};

export default nextConfig;
