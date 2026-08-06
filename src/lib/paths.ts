/**
 * Join site base (import.meta.env.BASE_URL) with a path segment.
 * Always produces a single-slash join regardless of trailing slash on base.
 */
export function withBase(path = "/"): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  if (!path || path === "/") return normalizedBase;
  const segment = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${segment}`;
}
