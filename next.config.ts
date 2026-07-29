import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer modern codecs on supporting phones (much smaller than JPEG)
    formats: ["image/avif", "image/webp"],
    // Mobile-first breakpoints so phones don't download desktop-sized files
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    // Allow high-quality requests from <Image quality={…}>
    qualities: [70, 75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
