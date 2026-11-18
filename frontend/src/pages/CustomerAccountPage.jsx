import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api, { apiErrorMessage } from "../services/api";
import { saveCustomerSession } from "../services/customerSession";
import useCustomerSession from "../hooks/useCustomerSession";
import { SITE } from "../helpers/site";
import "../styles/CustomerAccountPage.css";

export default function CustomerAccountPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isSignedIn, customer } = useCustomerSession();

  useEffect(() => {
    setError("");
  }, [mode]);

  useEffect(() => {
    if (isSignedIn) {
      navigate("/my-orders", { replace: true });
    }
  }, [isSignedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      const endpoint = mode === "login" ? "/api/customer/login" : "/api/customer/register";
      const payload =
        mode === "login"
          ? { email: cleanEmail, password }
          : {
              name: name.trim(),
              email: cleanEmail,
              password,
              phone: phone.trim(),
            };

      const { data } = await api.post(endpoint, payload, {
        authScope: "customer",
        skipAuth: true,
      });

      saveCustomerSession(data.token, data.customer);
      navigate("/my-orders");
    } catch (err) {
      // The same email can belong to the bakery owner. If the customer sign-in
      // fails, try the owner credentials before reporting an error, so one form
      // works for everyone.
      if (mode === "login") {
        try {
          const { data: ownerData } = await api.post(
            "/api/owner/login",
            { email: cleanEmail, password },
            { authScope: "owner", skipAuth: true }
          );

          localStorage.setItem("token", ownerData.token);
          navigate("/dashboard");
          return;
        } catch (ownerErr) {
          setError(apiErrorMessage(err, "Unable to continue. Please try again."));
          return;
        }
      }

      setError(apiErrorMessage(err, "Unable to continue. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accountPage">
      <div className="container accountLayout">
        <aside className="accountAside">
          <Link to="/" className="accountBrand">
            <span className="accountBrandName">{SITE.name}</span>
            <span className="accountBrandTag">Artisan Cake Studio</span>
          </Link>

          <h1 className="accountAsideTitle">
            Your cakes, <em>all in one place</em>
          </h1>
          <p className="accountAsideText">
            Create a free account to follow every order from baking to delivery
            and re-order your favourites in seconds.
          </p>

          <ul className="accountBenefits">
            <li>
              <HistoryIcon fontSize="small" />
              Track every order and its live status
            </li>
            <li>
              <LocalShippingIcon fontSize="small" />
              See delivery dates and order details anytime
            </li>
            <li>
              <FavoriteBorderIcon fontSize="small" />
              Re-order your favourite designs with one tap
            </li>
          </ul>

          <a href={`tel:${SITE.phone}`} className="accountAsideCall">
            Need a hand? Call {SITE.phoneDisplay}
          </a>
        </aside>

        <div className="accountPanel">
          <div className="accountTabs" role="tablist" aria-label="Account">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`accountTab ${mode === "login" ? "isActive" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`accountTab ${mode === "register" ? "isActive" : ""}`}
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          </div>

          <header className="accountPanelHead">
            <h2 className="accountPanelTitle">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="accountPanelSub">
              {mode === "login"
                ? "Sign in to see your orders and their progress."
                : "It takes a minute — then every order is one click away."}
            </p>
          </header>

          {error && <div className="alert alert-error accountAlert">{error}</div>}

          <form className="accountForm" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <label htmlFor="account-name">Full name</label>
                <div className="accountInputWrap">
                  <PersonOutlineIcon fontSize="small" />
                  <input
                    id="account-name"
                    type="text"
                    placeholder="Jane Perera"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="account-email">Email address</label>
              <div className="accountInputWrap">
                <PersonOutlineIcon fontSize="small" />
                <input
                  id="account-email"
                  type="email"
                  placeholder="jane@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="field">
                <label htmlFor="account-phone">Phone number (optional)</label>
                <div className="accountInputWrap">
                  <PersonOutlineIcon fontSize="small" />
                  <input
                    id="account-phone"
                    type="tel"
                    placeholder="077 000 0000"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="account-password">Password</label>
              <div className="accountInputWrap">
                <LockOutlinedIcon fontSize="small" />
                <input
                  id="account-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="accountToggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}
              {!loading && <ArrowForwardIcon fontSize="small" />}
            </button>
          </form>

          <p className="accountSwitch">
            {mode === "login"
              ? "New to Cake'O Clock?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <p className="accountOwnerHint">
            <StorefrontIcon fontSize="small" />
            <span>
              Cake studio owner? Sign in here and we will take you straight to
              your dashboard.
            </span>
          </p>

          {customer && (
            <p className="accountSwitch">
              Signed in as <strong>{customer.email}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
