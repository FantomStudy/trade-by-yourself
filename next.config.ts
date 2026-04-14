import type { NextConfig } from "next";

const S3_HOSTNAME = process.env.S3_HOSTNAME;
if (!S3_HOSTNAME) {
  throw new Error("S3_HOSTNAME is not defined in .env");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typedRoutes: true,

  images: {
    remotePatterns: [
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
