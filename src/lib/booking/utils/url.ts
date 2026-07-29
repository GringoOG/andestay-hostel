import type { ProviderRoomRef } from "../types";

export function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  if (!path || path === "/") return b || "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!b) return p;
  return `${b}${p}`;
}

export function withQuery(
  url: string,
  query?: Record<string, string>,
): string {
  if (!query || Object.keys(query).length === 0) return url;

  const isAbsolute = /^https?:\/\//i.test(url);
  const u = isAbsolute
    ? new URL(url)
    : new URL(url, "http://booking.local");

  for (const [key, value] of Object.entries(query)) {
    if (value !== "") u.searchParams.set(key, value);
  }

  if (!isAbsolute) {
    return `${u.pathname}${u.search}${u.hash}`;
  }
  return u.toString();
}

export function buildRoomUrl(
  baseUrl: string,
  defaultPath: string,
  ref: ProviderRoomRef | undefined,
  fallbackUrl: string,
): string {
  if (!ref) return fallbackUrl;
  if (ref.url) return withQuery(ref.url, ref.query);
  const path = ref.path ?? defaultPath;
  const baseQuery = { ...(ref.query ?? {}) };
  if (ref.externalId && !baseQuery.id_product) {
    // Providers may still set id_product explicitly in mapping.
  }
  return withQuery(joinUrl(baseUrl, path), baseQuery);
}

export function navigateTo(url: string, openInNewTab: boolean): void {
  if (typeof window === "undefined") return;
  if (openInNewTab) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(url);
}
