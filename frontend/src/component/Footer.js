import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Logo from "../assets/logo.png";
import { NAV_LINKS, SITE } from "../helpers/site";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import "../styles/Footer.css";

const SOCIALS = [
  { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
  { label: "WhatsApp", href: SITE.socials.whatsapp, Icon: WhatsAppIcon },
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="siteFooter">
      <div className="footerMain">
        <div className="container footerGrid">
          <div className="footerCol footerColBrand">
            <Link to="/" className="footerBrand">
              <span className="footerBrandMark">
                <img src={Logo} alt="" />
              </span>
              <span className="footerBrandName">{SITE.name}</span>
            </Link>
            <p className="footerAbout">{SITE.description}</p>
            <div className="footerSocials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="footerSocial"
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon fontSize="small" />
                </a>
              ))}
            </div>
          </div>

          <div className="footerCol">
            <h3 className="footerColTitle">Explore</h3>
            <ul className="footerList">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footerLink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/account" className="footerLink">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="footerLink">
                  Owner Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h3 className="footerColTitle">Our Cakes</h3>
            <ul className="footerList">
              {CAKE_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link to={category.to} className="footerLink">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footerCol">
            <h3 className="footerColTitle">Visit &amp; Call</h3>
            <ul className="footerContact">
              <li>
                <LocationOnIcon fontSize="small" />
                <a
                  href={SITE.mapUrl}
                  className="footerLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.address}
                </a>
              </li>
              <li>
                <PhoneIcon fontSize="small" />
                <a href={`tel:${SITE.phone}`} className="footerLink">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <EmailIcon fontSize="small" />
                <a href={`mailto:${SITE.email}`} className="footerLink">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <div className="footerHours">
              <p className="footerHoursTitle">
                <AccessTimeIcon fontSize="small" />
                Opening Hours
              </p>
              {SITE.hours.map((slot) => (
                <p key={slot.day} className="footerHoursRow">
                  <span>{slot.day}</span>
                  <span>{slot.time}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <div className="container footerBottomInner">
          <p className="footerCopy">
            &copy; {new Date().getFullYear()} {SITE.legalName}. All rights
            reserved.
          </p>
          <p className="footerMade">Handcrafted with love in Sri Lanka</p>
          <button
            type="button"
            className="footerTopBtn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUpwardIcon fontSize="small" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;