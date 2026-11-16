import { getApiBaseUrl } from "./apiBaseUrl";

/**
 * Resolves a stored cake image reference to something the browser can load.
 *
 * - `data:` and `http(s):` values are already absolute.
 * - `/uploads/...` paths are served by the backend, so they need the API host.
 * - Anything else (e.g. `/static/media/...` from Create React App) is served
 *   by the front-end and can be used as-is.
 */
export function resolveImageUrl(image) {
  if (!image) return "";

  const value = String(image);

  if (/^(data:|https?:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return `${getApiBaseUrl()}${value}`;
  }

  return value;
}