import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone for development
  // output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set the port
  experimental: {
    turbo: {
      // Turbopack configuration
    }
  }
}

export default nextConfig;
