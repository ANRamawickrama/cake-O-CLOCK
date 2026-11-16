import axios from "axios";
import { getApiBaseUrl } from "../helpers/apiBaseUrl";

/**
 * Shared axios instance so every page talks to the backend through one
 * place. The base URL is resolved at request time (not import time) so the
 * app works on localhost, on a preview domain and in production.
 */
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
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