import axios from "axios";
import { getApiBaseUrl } from "../helpers/apiBaseUrl";
import { clearCustomerSession } from "./customerSession";

/**
 * Shared axios instance so every page talks to the backend through one
 * place. The base URL is resolved at request time (not import time) so the
 * app works on localhost, on a preview domain and in production.
 */
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
});

const isCustomerRoute = (url = "") => url.includes("/api/customer");

api.interceptors.request.use((config) => {
  // Customer routes use the customer session, everything else uses the owner
  // session. `authScope: "customer"` lets public routes (such as placing an
  // order) carry the customer token when one exists.
  const scope =
    config.authScope ||
    (isCustomerRoute(config.url) ? "customer" : "owner");

  const token =
    scope === "customer"
      ? localStorage.getItem("customerToken")
      : localStorage.getItem("token");

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config || {};
    const usedCustomerScope =
      config.authScope === "customer" || isCustomerRoute(config.url);

    if (status === 401) {
      if (usedCustomerScope) {
        // Only clear the session when a customer token was actually sent, so a
        // signed-out visitor is not bounced to the account page.
        if (config.headers?.Authorization) {
          clearCustomerSession();
          if (!window.location.pathname.startsWith("/account")) {
            window.location.assign("/account");
          }
        }
      } else {
        localStorage.removeItem("token");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

export const apiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  (error?.code === "ECONNABORTED"
    ? "The request timed out. Please check your connection and try again."
    : fallback);

export default api;