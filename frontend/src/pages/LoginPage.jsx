import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api, { apiErrorMessage } from "../services/api";
import { SITE } from "../helpers/site";
import "./LoginPage.css";

export default function LoginPage({ setToken }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { data } = await api.post("/api/owner/login", {
          email: email.trim(),
          password,
        });

        localStorage.setItem("token", data.token);
        setToken?.(data.token);
        navigate("/dashboard");
      } else {
        await api.post("/api/owner/register", {
          email: email.trim(),
          password,
        });
        const { data } = await api.post("/api/owner/login", {
          email: email.trim(),
          password,
        });

        localStorage.setItem("token", data.token);
        setToken?.(data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="container loginLayout">
        <aside className="loginAside">
          <Link to="/" className="loginBrand">
            <span className="loginBrandName">{SITE.name}</span>
            <span className="loginBrandTag">Artisan Cake Studio</span>
          </Link>

          <h1 className="loginAsideTitle">
            Run your bakery from <em>one place</em>
          </h1>
          <p className="loginAsideText">
            Upload new designs, keep prices up to date and track every customer
            order from pending to delivered.
          </p>

          <ul className="loginBenefits">
            <li>Upload and manage your cake menu</li>
            <li>Track orders with live status updates</li>
            <li>Read customer reviews in one place</li>
          </ul>

          <a href={`tel:${SITE.phone}`} className="loginAsideCall">
            Need a hand? Call {SITE.phoneDisplay}
          </a>
        </aside>

        <div className="loginPanel">
          <div className="loginTabs" role="tablist" aria-label="Account">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`loginTab ${mode === "login" ? "isActive" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`loginTab ${mode === "register" ? "isActive" : ""}`}
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          </div>

          <header className="loginPanelHead">
            <h2 className="loginPanelTitle">
              {mode === "login" ? "Owner sign in" : "Create an owner account"}
            </h2>
            <p className="loginPanelSub">
              {mode === "login"
                ? "Enter your details to open the dashboard."
                : "Set up an owner account to start managing your menu."}
            </p>
          </header>

          {error && <div className="alert alert-error loginAlert">{error}</div>}

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <div className="loginInputWrap">
                <PersonOutlineIcon fontSize="small" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="owner@cakeoclock.lk"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="loginInputWrap">
                <LockOutlinedIcon fontSize="small" />
                <input
                  id="login-password"
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
                  className="loginToggle"
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
                ? "Sign in to dashboard"
                : "Create account"}
              {!loading && <ArrowForwardIcon fontSize="small" />}
            </button>
          </form>

          <p className="loginSwitch">
            {mode === "login"
              ? "No owner account yet?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
