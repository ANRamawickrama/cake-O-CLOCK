import React, { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="siteFooter">
      <div className="footerTop">
        <div className="container footerTopInner">
          <div className="footerPitch">
            <h2 className="footerTitle">
              Let&apos;s bake something <em>unforgettable</em>
            </h2>
            <p className="footerPitchText">
              Tell us the occasion, the colours and the number of guests — our
              kitchen will design and deliver a cake that feels made just for
              you.
            </p>
            <div className="footerPitchActions">
              <Link to="/menu" className="btn btn-gold">
                Browse the Menu
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="footerPitchCall"
              >
                <PhoneIcon fontSize="small" />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <form className="footerSubscribe" onSubmit={handleSubscribe}>
            <h3 className="footerSubscribeTitle">Get cake updates</h3>
            <p className="footerSubscribeText">
              New designs, seasonal flavours and early-bird offers. No spam,
              only sweetness.
            </p>
            {subscribed ? (
              <p className="footerSubscribeDone">
                Thank you! You&apos;re on the list.
              </p>
            ) : (
              <div className="footerSubscribeForm">
                <label className="srOnly" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button type="submit" className="footerSubscribeBtn">
                  Subscribe
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

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
                <span>{SITE.address}</span>
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