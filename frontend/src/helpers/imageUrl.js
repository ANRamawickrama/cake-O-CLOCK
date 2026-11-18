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
    const catalogueMatch = /^\/uploads\/catalogue-(birthday|cupcake|anniversary|structure)-(\d+)\.(jpg|jpeg|png|webp)$/i.exec(value);
    if (catalogueMatch) {
      const folder = catalogueMatch[1] === "structure"
        ? "structures"
        : catalogueMatch[1];
      return `https://raw.githubusercontent.com/ANRamawickrama/cake-O-CLOCK/main/frontend/src/assets/${folder}/${catalogueMatch[2]}.${catalogueMatch[3].toLowerCase()}`;
    }

    if (/^\/uploads\/catalogue-jar\.(jpg|jpeg|png|webp)$/i.test(value)) {
      return "https://raw.githubusercontent.com/ANRamawickrama/cake-O-CLOCK/main/frontend/src/assets/jar.jpg";
    }

    if (/^\/uploads\/catalogue-wedding\.(jpg|jpeg|png|webp)$/i.test(value)) {
      return "https://raw.githubusercontent.com/ANRamawickrama/cake-O-CLOCK/main/frontend/src/assets/weddingcake.jpg";
    }

    return `${getApiBaseUrl()}${value}`;
  }

  return value;
}