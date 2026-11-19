import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import api from "../services/api";
import HomeHeroImage from "../assets/homee.jpg";
import AboutImage from "../assets/about.jpg";
import useReveal from "../hooks/useReveal";
import CakeImage from "../component/CakeImage";
import { CAKE_CATEGORIES } from "../helpers/cakeCatalog";
import { formatPrice, SITE } from "../helpers/site";
import "../styles/Home.css";

const STATS = [
  { value: "10+", label: "Years of baking" },
  { value: "2,500+", label: "Cakes delivered" },
  { value: "4.9", label: "Average rating" },
  { value: "100%", label: "Made by hand" },
];

const PROMISES = [
  {
    Icon: AutoAwesomeIcon,
    title: "Bespoke designs",
    text: "Your idea, drawn and perfected by our cake artists.",
  },
  {
    Icon: CakeOutlinedIcon,
    title: "Fresh daily",
    text: "Baked the morning it reaches your celebration.",
  },
  {
    Icon: LocalShippingIcon,
    title: "Reliable delivery",
    text: "Timed island-wide delivery with careful packing.",
  },
];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const featuredRef = useReveal();
  const storyRef = useReveal();
  const categoriesRef = useReveal();

  useEffect(() => {
    let active = true;

    const loadFeatured = async () => {
      try {
        const { data } = await api.get("/api/cakes/featured");
        if (!active) return;

        const cakes = data || [];
        if (cakes.length > 0) {
          setFeatured(cakes.slice(0, 3));
          return;
        }

        // Nothing is highlighted yet - fall back to one design per category.
        const all = await api.get("/api/cakes");
        if (!active) return;

        const newestPerType = new Map();
        (all.data || []).forEach((cake) => {
          if (!newestPerType.has(cake.type)) {
            newestPerType.set(cake.type, cake);
          }
        });
        setFeatured(Array.from(newestPerType.values()).slice(0, 3));
      } catch (error) {
        if (active) setFeatured([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFeatured();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="homePage">
      <section className="hero">
        <div className="heroMedia" aria-hidden="true">
          <img src={HomeHeroImage} alt="" />
          <span className="heroScrim" />
        </div>

        <div className="container heroInner">
          <div className="heroContent">
            <p className="heroEyebrow">
              <span className="heroEyebrowDot" />
              Artisan cake studio · Matara
            </p>
            <h1 className="heroTitle">
              Cakes that make every
              <em> celebration unforgettable</em>
            </h1>
            <p className="heroText">
              Handcrafted birthday, wedding and dessert cakes — designed to
              your story, baked fresh and delivered right to your door.
            </p>
            <div className="heroActions">
              <Link to="/menu" className="btn btn-gold btn-lg">
                Explore the Menu
                <ArrowForwardIcon fontSize="small" />
              </Link>
              <a href={`tel:${SITE.phone}`} className="btn btn-ghost-light btn-lg">
                <PhoneIcon fontSize="small" />
                {SITE.phoneDisplay}
              </a>
            </div>
            <div className="heroRating">
              <span className="heroStars" aria-hidden="true">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} fontSize="inherit" />
                ))}
              </span>
              <span className="heroRatingText">
                Rated 4.9/5 by our customers
              </span>
            </div>
          </div>
        </div>

        <div className="heroStats container">
          {STATS.map((stat) => (
            <div key={stat.label} className="heroStat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="container reveal" ref={featuredRef}>
          <div className="section-head">
            <p className="eyebrow">Fresh from the kitchen</p>
            <h2 className="section-title">
              Our most-loved <em>designs</em>
            </h2>
            <p className="section-sub">
              A handpicked selection from every collection — order them exactly
              as shown, or ask us for a custom variation.
            </p>
          </div>

          {loading ? (
            <div className="homeFeaturedGrid">
              {[0, 1, 2].map((index) => (
                <div key={index} className="homeSkeleton" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="homeFeaturedGrid">
              {featured.map((cake) => {
                const category = CAKE_CATEGORIES.find(
                  (item) => item.type === cake.type
                );
                const title = cake.name || cake.type;

                return (
                  <Link
                    key={cake._id}
                    to={category ? category.to : "/menu"}
                    className="homeFeaturedCard"
                  >
                    <div className="homeFeaturedMedia">
                      <CakeImage src={cake.image} alt={title} loading="lazy" />
                      <span className="homeFeaturedTag">{cake.type}</span>
                    </div>
                    <div className="homeFeaturedBody">
                      <h3 className="homeFeaturedTitle">{title}</h3>
                      {cake.description && (
                        <p className="homeFeaturedText">{cake.description}</p>
                      )}
                      <span className="homeFeaturedPrice">
                        {formatPrice(cake.price)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="homeFeaturedGrid">
              {CAKE_CATEGORIES.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  to={category.to}
                  className="homeFeaturedCard"
                >
                  <div className="homeFeaturedMedia">
                    <img src={category.image} alt={category.title} loading="lazy" />
                  </div>
                  <div className="homeFeaturedBody">
                    <h3 className="homeFeaturedTitle">{category.title}</h3>
                    <p className="homeFeaturedText">{category.description}</p>
                    <span className="homeFeaturedPrice">
                      From {formatPrice(category.priceFrom)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="homeCenterCta">
            <Link to="/menu" className="btn btn-primary btn-lg">
              View all collections
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container homeStory reveal" ref={storyRef}>
          <div className="homeStoryMedia">
            <img src={AboutImage} alt="Our cake studio" />
            <div className="homeStoryBadge">
              <strong>10+</strong>
              <span>Years of craft</span>
            </div>
          </div>

          <div className="homeStoryCopy">
            <p className="eyebrow">Our story</p>
            <h2 className="section-title">
              Baking with <em>care since day one</em>
            </h2>
            <p className="homeStoryText">
              What started as a small family kitchen has grown into a full
              studio of cake artists. We still measure every batch by hand,
              choose every flavour ourselves, and treat every order as if it
              were for our own family.
            </p>
            <p className="homeStoryText">
              From a first birthday to a three-tier wedding centrepiece, our
              team turns your vision into something people remember.
            </p>

            <div className="homePromiseList">
              {PROMISES.map(({ Icon, title, text }) => (
                <div key={title} className="homePromise">
                  <span className="homePromiseIcon">
                    <Icon fontSize="small" />
                  </span>
                  <div>
                    <h3 className="homePromiseTitle">{title}</h3>
                    <p className="homePromiseText">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn btn-outline btn-lg">
              More about us
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--blush">
        <div className="container reveal" ref={categoriesRef}>
          <div className="section-head">
            <p className="eyebrow">What we do best</p>
            <h2 className="section-title">
              Everything you need for a <em>perfect cake</em>
            </h2>
          </div>

          <div className="homeCategoryGrid">
            {CAKE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={category.to}
                className="homeCategoryCard"
                style={{ "--accent": category.accent }}
              >
                <img src={category.image} alt="" loading="lazy" />
                <div className="homeCategoryOverlay">
                  <h3>{category.title}</h3>
                  <span>Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="homeFinalCta">
        <div className="container homeFinalInner">
          <h2 className="homeFinalTitle">
            Ready to order your <em>dream cake</em>?
          </h2>
          <p className="homeFinalText">
            Call us with your date and idea, or send a custom request online —
            we usually reply within a few hours.
          </p>
          <div className="homeFinalActions">
            <Link to="/contact" className="btn btn-gold btn-lg">
              Start your order
              <ArrowForwardIcon fontSize="small" />
            </Link>
            <a href={`tel:${SITE.phone}`} className="btn btn-ghost-light btn-lg">
              <PhoneIcon fontSize="small" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;