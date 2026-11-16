import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "../services/api";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import { formatPrice } from "../helpers/site";
import "../styles/Menu.css";

const HIGHLIGHTS = [
  {
    Icon: AutoAwesomeIcon,
    title: "Designed by you",
    text: "Every detail tailored to your theme, colours and message.",
  },
  {
    Icon: CakeOutlinedIcon,
    title: "Baked fresh",
    text: "Made to order in our kitchen — never frozen or mass produced.",
  },
  {
    Icon: LocalShippingIcon,
    title: "Island-wide delivery",
    text: "Carefully packed and delivered across Sri Lanka on your date.",
  },
  {
    Icon: VerifiedIcon,
    title: "Quality assured",
    text: "Premium ingredients, food-safe handling and hygienic packing.",
  },
];

function Menu() {
  const [remoteCounts, setRemoteCounts] = useState({});
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const loadCounts = async () => {
      try {
        const { data } = await api.get("/api/cakes");
        if (!active) return;

        const counts = {};
        (data || []).forEach((cake) => {
          counts[cake.type] = (counts[cake.type] || 0) + 1;
        });
        setRemoteCounts(counts);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus("offline");
      }
    };

    loadCounts();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      CAKE_CATEGORIES.map((category) => ({
        ...category,
        liveCount: remoteCounts[category.type] || 0,
      })),
    [remoteCounts]
  );

  const totalDesigns = categories.reduce(
    (sum, category) => sum + category.designs + category.liveCount,
    0
  );

  return (
    <div className="menuPage">
      <section className="menuHero">
        <div className="container menuHeroInner">
          <div className="menuHeroCopy">
            <p className="eyebrow">Our Collection</p>
            <h1 className="menuHeroTitle">
              Find the perfect cake for <em>your celebration</em>
            </h1>
            <p className="menuHeroText">
              Six signature collections, {totalDesigns}+ designs and a fully
              custom option — every cake is baked fresh and finished by hand to
              match your occasion.
            </p>
            <div className="menuHeroActions">
              <a className="btn btn-primary" href="#collections">
                Browse collections
                <ArrowForwardIcon fontSize="small" />
              </a>
              <Link className="btn btn-outline" to="/contact">
                Request a custom design
              </Link>
            </div>
          </div>

          <aside className="menuHeroPanel">
            <div className="menuHeroStat">
              <strong>{totalDesigns}+</strong>
              <span>Designs ready to order</span>
            </div>
            <div className="menuHeroStat">
              <strong>6</strong>
              <span>Signature collections</span>
            </div>
            <div className="menuHeroStat">
              <strong>48h</strong>
              <span>Custom design turnaround</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--paper section--tight" id="collections">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">Browse by category</p>
              <h2 className="section-title">
                Choose your <em>flavour of celebration</em>
              </h2>
            </div>
            <p className="section-sub">
              Each collection includes ready-to-order designs. Pick one to order
              as-is, or send us a custom request for something entirely your
              own.
            </p>
          </div>

          <div className="menuGrid">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={category.to}
                className="menuCard"
                style={{ "--accent": category.accent, "--delay": `${index * 70}ms` }}
              >
                <div className="menuCardMedia">
                  <img src={category.image} alt={category.title} loading="lazy" />
                  <span className="menuCardBadge">
                    {category.designs + category.liveCount} designs
                  </span>
                </div>

                <div className="menuCardBody">
                  <p className="menuCardTagline">{category.tagline}</p>
                  <h3 className="menuCardTitle">{category.title}</h3>
                  <p className="menuCardText">{category.description}</p>

                  <div className="menuCardFoot">
                    <span className="menuCardPrice">
                      From {formatPrice(category.priceFrom)}
                    </span>
                    <span className="menuCardArrow" aria-hidden="true">
                      <ArrowForwardIcon fontSize="small" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {status === "offline" && (
            <p className="menuOfflineNote">
              Showing our standard collection right now — live updates will
              appear once the kitchen reconnects.
            </p>
          )}
        </div>
      </section>

      <section className="section section--blush">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Why Cake&apos;O Clock</p>
            <h2 className="section-title">
              The details that make it <em>ours</em>
            </h2>
          </div>

          <div className="highlightGrid">
            {HIGHLIGHTS.map(({ Icon, title, text }) => (
              <div key={title} className="highlightCard">
                <span className="highlightIcon">
                  <Icon fontSize="small" />
                </span>
                <h3 className="highlightTitle">{title}</h3>
                <p className="highlightText">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="menuCta">
        <div className="container menuCtaInner">
          <div>
            <h2 className="menuCtaTitle">Need something unique?</h2>
            <p className="menuCtaText">
              Share your idea — flavour, colours, size and guest count — and we
              will design it from scratch just for you.
            </p>
          </div>
          <div className="menuCtaActions">
            <Link to="/contact" className="btn btn-gold btn-lg">
              Request a Custom Design
              <ArrowForwardIcon fontSize="small" />
            </Link>
            <Link to="/reviews" className="btn btn-ghost-light btn-lg">
              Read customer reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;