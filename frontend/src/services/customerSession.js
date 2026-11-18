const TOKEN_KEY = "customerToken";
const CUSTOMER_KEY = "customer";

export const CUSTOMER_SESSION_EVENT = "cake-clock:customer-session";

/**
 * Customer session lives in its own storage keys so it never clashes with the
 * owner token used by the dashboard.
 */
export function getCustomerSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(CUSTOMER_KEY);
    const customer = raw ? JSON.parse(raw) : null;

    if (!token || !customer) return null;
    return { token, customer };
  } catch (err) {
    return null;
  }
}

export function saveCustomerSession(token, customer) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  window.dispatchEvent(new Event(CUSTOMER_SESSION_EVENT));
}

export function clearCustomerSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
  window.dispatchEvent(new Event(CUSTOMER_SESSION_EVENT));
}
