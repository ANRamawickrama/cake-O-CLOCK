import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AboutImage from "../assets/about.jpg";
import HomeImage from "../assets/homee.jpg";
import "../styles/About.css";

const VALUES = [
  {
    Icon: AutoAwesomeIcon,
    title: "Designed by hand",
    text: "Every cake starts as a sketch from our cake artists — never a template copied from a screen.",
  },
  {
    Icon: GroupsIcon,
    title: "Small team, big care",
    text: "The same people who take your call are the ones who pipe, stack and pack your cake.",
  },
  {
    Icon: VerifiedIcon,
    title: "Food-safe kitchen",
    text: "Hygienic preparation, chilled storage and fresh delivery windows on every order.",
  },
  {
    Icon: LocalShippingIcon,
    title: "On-time delivery",
    text: "We plan our baking schedule around your celebration so it arrives when it should.",
  },
];

const TIMELINE = [
  {
    year: "2015",
    title: "A kitchen and a dream",
    text: "Cake'O Clock started as a home kitchen taking weekend orders for friends and family.",
  },
  {
    year: "2018",
    title: "Our first storefront",
    text: "Demand grew into a small shopfront with a proper prep kitchen and a delivery team.",
  },
  {
    year: "2021",
    title: "Wedding specialists",
    text: "We added large-format cake structures and full wedding setup to our service list.",
  },
  {
    year: "Today",
    title: "2,500+ celebrations",
    text: "More than two thousand cakes later, every order is still baked by hand to order.",
  },
];

function About() {
  return (
    <div className="aboutPage">
      <section className="aboutHero">
        <div className="container aboutHeroInner">
          <div className="aboutHeroCopy">
            <p className="eyebrow">Our story</p>
            <h1 className="aboutTitle">
              Always in good <em>taste</em>
            </h1>
            <p className="aboutText">
              Our mission is to bring you the largest selection of handcrafted
              cakes and desserts, made with the same care we would give our own
              family. We are here for our customers, and we want each one of
              them to have a unique, one-of-a-kind experience at our cake shop.
            </p>
            <div className="aboutHeroActions">
              <Link to="/menu" className="btn btn-primary btn-lg">
                Explore the menu
                <ArrowForwardIcon fontSize="small" />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Request a custom cake
              </Link>
            </div>
          </div>

          <div className="aboutHeroMedia">
            <img src={AboutImage} alt="Inside the Cake'O Clock kitchen" />
            <span className="aboutHeroBadge">
              <strong>10+</strong>
              <span>Years of baking</span>
            </span>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we stand for</p>
            <h2 className="section-title">
              The values behind <em>every cake</em>
            </h2>
          </div>

          <div className="aboutValueGrid">
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="aboutValue">
                <span className="aboutValueIcon">
                  <Icon fontSize="small" />
                </span>
                <h3 className="aboutValueTitle">{title}</h3>
                <p className="aboutValueText">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container aboutTimeline">
          <div className="aboutTimelineCopy">
            <p className="eyebrow">How we grew</p>
            <h2 className="section-title">
              From a home kitchen to <em>your celebrations</em>
            </h2>
            <p className="aboutText">
              We never wanted to become a factory. Every step of the business
              has been about making the same cakes we would happily serve at our
              own table — and passing them on to yours.
            </p>
            <Link to="/reviews" className="btn btn-outline">
              Read what customers say
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <ol className="aboutTimelineList">
            {TIMELINE.map((entry) => (
              <li key={entry.year} className="aboutTimelineItem">
                <span className="aboutTimelineYear">{entry.year}</span>
                <div>
                  <h3 className="aboutTimelineTitle">{entry.title}</h3>
                  <p className="aboutTimelineText">{entry.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="aboutCta">
        <div className="container aboutCtaInner">
          <img src={HomeImage} alt="" aria-hidden="true" />
          <div className="aboutCtaBody">
            <h2 className="aboutCtaTitle">
              Let's bake your <em>next memory</em>
            </h2>
            <p className="aboutCtaText">
              Browse the collection or tell us exactly what you have in mind —
              we will craft it from scratch.
            </p>
            <div className="aboutCtaActions">
              <Link to="/menu" className="btn btn-gold btn-lg">
                See the collection
                <ArrowForwardIcon fontSize="small" />
              </Link>
              <Link to="/contact" className="btn btn-ghost-light btn-lg">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
