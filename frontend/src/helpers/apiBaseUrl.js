export function getApiBaseUrl() {
  const configuredUrl = process.env.REACT_APP_API_URL?.trim();

  const isLocalHostUrl = (url) => /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(url);
  const normalizeUrl = (url) => url.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    const isLocalFrontend = hostname === "localhost" || hostname === "127.0.0.1";

    if (configuredUrl && !( !isLocalFrontend && isLocalHostUrl(configuredUrl) )) {
      return normalizeUrl(configuredUrl);
    }

    if (isLocalFrontend) {
      return "http://localhost:5000";
    }

    return origin;
  }

  return configuredUrl ? normalizeUrl(configuredUrl) : "http://localhost:5000";
}