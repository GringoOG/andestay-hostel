import type { NextConfig } from "next";

/**
 * Security headers for the marketing site (Vercel).
 * CSP is intentionally moderate: Next.js + Sanity CDN images + Google Fonts if used.
 * Tighten further after verifying all third-party origins in production.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "form-action 'self'",
      // Next.js / React require inline scripts & styles in App Router builds
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://book.andestay.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Prefer modern codecs on supporting phones (much smaller than JPEG)
    formats: ["image/avif", "image/webp"],
    // Mobile-first breakpoints so phones don't download desktop-sized files
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    // Allow high-quality requests from <Image quality={…}>
    qualities: [70, 75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Sanity CDN (ContentRepository media) — deny arbitrary remote hosts
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
