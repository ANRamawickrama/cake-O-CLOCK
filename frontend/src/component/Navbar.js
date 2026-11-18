import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Logo from "../assets/logo.png";
import { NAV_LINKS, SITE } from "../helpers/site";
import useCustomerSession from "../hooks/useCustomerSession";
import "../styles/Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, customer } = useCustomerSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isAccountRoute =
    location.pathname.startsWith("/account") ||
    location.pathname.startsWith("/my-orders");
  const isOwnerRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/manage") ||
    location.pathname.startsWith("/update") ||
    location.pathname.startsWith("/orders");

  return (
    <>
      <header className={`siteHeader ${scrolled ? "isScrolled" : ""}`}>
        <div className="announceBar">
          <div className="container announceInner">
            <p className="announceNote">
              <span className="announceDot" aria-hidden="true" />
              Island-wide delivery · Freshly baked to order
            </p>
            <a className="announcePhone" href={`tel:${SITE.phone}`}>
              <PhoneIcon fontSize="inherit" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="navBar">
          <div className="container navInner">
            <Link to="/" className="brand" aria-label={`${SITE.name} home`}>
              <span className="brandMark">
                <img src={Logo} alt="" />
              </span>
              <span className="brandText">
                <span className="brandName">{SITE.name}</span>
                <span className="brandTag">Artisan Cake Studio</span>
              </span>
            </Link>

            <nav className="navLinks" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `navLink ${isActive ? "isActive" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="navActions">
              <Link
                to={isSignedIn ? "/my-orders" : "/account"}
                className={`ownerLink ${isAccountRoute ? "isActive" : ""}`}
                title={isSignedIn ? "Your orders" : "Sign in or create an account"}
              >
                <PersonOutlineIcon fontSize="small" />
                <span>{isSignedIn ? customer?.name?.split(" ")[0] || "My Orders" : "Account"}</span>
              </Link>
              <Link
                to="/login"
                className={`ownerIconLink ${isOwnerRoute ? "isActive" : ""}`}
                title="Owner dashboard"
                aria-label="Owner dashboard"
              >
                <StorefrontIcon fontSize="small" />
              </Link>
              <Link to="/menu" className="btn btn-primary btn-sm navCta">
                Order Now
                <ArrowForwardIcon fontSize="small" />
              </Link>
              <button
                type="button"
                className="menuToggle"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`mobileDrawer ${menuOpen ? "isOpen" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobileLinks" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              style={{ "--i": index }}
              className={({ isActive }) =>
                `mobileLink ${isActive ? "isActive" : ""}`
              }
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="mobileLinkIndex">0{index + 1}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mobileActions">
          <Link
            to="/menu"
            className="btn btn-primary btn-lg btn-block"
            tabIndex={menuOpen ? 0 : -1}
          >
            Order Now
            <ArrowForwardIcon fontSize="small" />
          </Link>
          <Link
            to={isSignedIn ? "/my-orders" : "/account"}
            className="btn btn-outline btn-lg btn-block"
            tabIndex={menuOpen ? 0 : -1}
          >
            <PersonOutlineIcon fontSize="small" />
            {isSignedIn ? "My Orders" : "Sign in"}
          </Link>
          <Link
            to="/login"
            className="mobileOwnerLink"
            tabIndex={menuOpen ? 0 : -1}
          >
            <StorefrontIcon fontSize="small" />
            Owner dashboard
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            className="mobileCall"
            tabIndex={menuOpen ? 0 : -1}
          >
            <PhoneIcon fontSize="small" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="drawerScrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
