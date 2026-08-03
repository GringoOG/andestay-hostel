import type { ContentConfig, ContentProviderId } from "./types";

function env(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

function parseProvider(raw: string): ContentProviderId {
  const value = raw.toLowerCase();
  if (value === "sanity" || value === "api" || value === "local") return value;
  return "local";
}

/**
 * Content source switch — same pattern as bookingConfig.
 *
 * - local  → site-data + hotel/
 * - sanity → Sanity API with automatic local fallback on failure / empty
 * - api    → future admin API
 */
export const contentConfig: ContentConfig = {
  provider: parseProvider(env("NEXT_PUBLIC_CONTENT_PROVIDER", "local")),
  sanityProjectId: env("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  sanityDataset: env("NEXT_PUBLIC_SANITY_DATASET", "production"),
  sanityApiVersion: env(
    "NEXT_PUBLIC_SANITY_API_VERSION",
    env("SANITY_API_VERSION", "2024-01-01"),
  ),
  /** Server-only token (drafts / private datasets). Never NEXT_PUBLIC_. */
  sanityApiToken: env("SANITY_API_TOKEN"),
  apiBaseUrl: env("NEXT_PUBLIC_CONTENT_API_BASE_URL"),
};
