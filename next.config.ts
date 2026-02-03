import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Enable server actions for Next.js 15
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "iaco.app",
        "www.iaco.app",
        "https://iaco.app",
        "https://www.iaco.app",
      ],
    },
  },
    outputFileTracingIncludes: {
    "/*": ["node_modules/styled-jsx/**"],
  },
  // Enable TypeScript strict mode for better type safety
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);