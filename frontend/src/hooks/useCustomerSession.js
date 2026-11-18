import { useCallback, useEffect, useState } from "react";
import {
  CUSTOMER_SESSION_EVENT,
  clearCustomerSession,
  getCustomerSession,
} from "../services/customerSession";

/**
 * Keeps every component in sync with the signed-in customer.
 */
export default function useCustomerSession() {
  const [session, setSession] = useState(() => getCustomerSession());

  useEffect(() => {
    const sync = () => setSession(getCustomerSession());

    window.addEventListener(CUSTOMER_SESSION_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CUSTOMER_SESSION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signOut = useCallback(() => {
    clearCustomerSession();
    setSession(null);
  }, []);

  return {
    customer: session?.customer || null,
    token: session?.token || "",
    isSignedIn: Boolean(session?.token),
    signOut,
  };
}
