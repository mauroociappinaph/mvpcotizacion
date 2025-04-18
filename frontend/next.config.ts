import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["httplazy"],
  experimental: {
    // @ts-expect-error - allowedDevOrigins is a valid experimental property
    allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.197']
  }
};

export default nextConfig;
