/**
 * Sanity HTTP client for ContentRepository.
 * No Sanity SDK in React — only this module talks to the Content Lake.
 */

import { contentConfig } from "../config";

export class SanityClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "SanityClientError";
  }
}

function apiBase(useCdn: boolean): string {
  const { sanityProjectId, sanityDataset, sanityApiVersion, sanityApiToken } =
    contentConfig;

  if (!sanityProjectId) {
    throw new SanityClientError(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID — cannot query Sanity.",
    );
  }

  // Authenticated requests must hit the API host (not CDN).
  const host =
    sanityApiToken || !useCdn
      ? `${sanityProjectId}.api.sanity.io`
      : `${sanityProjectId}.apicdn.sanity.io`;

  return `https://${host}/v${sanityApiVersion}/data/query/${sanityDataset}`;
}

export type SanityFetchOptions = {
  /** Skip CDN (always true when SANITY_API_TOKEN is set). */
  useCdn?: boolean;
  /** Next.js fetch cache — default revalidate 60s. */
  revalidate?: number | false;
  params?: Record<string, string | number | boolean | null>;
};

/**
 * Run a GROQ query against the configured Sanity project.
 */
export async function sanityFetch<T>(
  query: string,
  options: SanityFetchOptions = {},
): Promise<T> {
  const { sanityApiToken } = contentConfig;
  const useCdn = sanityApiToken ? false : (options.useCdn ?? true);
  const url = new URL(apiBase(useCdn));
  url.searchParams.set("query", query);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }
  }

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (sanityApiToken) {
    headers.Authorization = `Bearer ${sanityApiToken}`;
  }

  const init: RequestInit & { next?: { revalidate?: number | false } } = {
    headers,
    next:
      options.revalidate === false
        ? { revalidate: 0 }
        : { revalidate: options.revalidate ?? 60 },
  };

  let res: Response;
  try {
    res = await fetch(url.toString(), init);
  } catch (cause) {
    throw new SanityClientError("Sanity network request failed", undefined, cause);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new SanityClientError(
      `Sanity query failed (${res.status}): ${body.slice(0, 400)}`,
      res.status,
    );
  }

  const json = (await res.json()) as { result: T };
  return json.result;
}

export function isSanityConfigured(): boolean {
  return Boolean(contentConfig.sanityProjectId && contentConfig.sanityDataset);
}
