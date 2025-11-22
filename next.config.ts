import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: "standalone",

  // images: {
  //   unoptimized: true,
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "3000",
  //       pathname: "/**",
  //     },
  //   ],
  // },
};

export default nextConfig;
