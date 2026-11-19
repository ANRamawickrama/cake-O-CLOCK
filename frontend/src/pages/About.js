import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AboutImage from "../assets/udari.jpg";
import HomeImage from "../assets/homee.jpg";
import "../styles/About.css";

const VALUES = [
  {
    Icon: AutoAwesomeIcon,
    title: "Creative designs",
    text: "Every cake is thoughtfully designed around your celebration and personal style.",
  },
  {
    Icon: GroupsIcon,
    title: "Made with care",
    text: "We bring passion, patience and a personal touch to every creation.",
  },
  {
    Icon: VerifiedIcon,
    title: "Quality ingredients",
    text: "Beautiful cakes deserve delicious flavours, made with carefully selected ingredients.",
  },
  {
    Icon: LocalShippingIcon,
    title: "Made for moments",
    text: "From birthdays to milestones, we create cakes that make memories sweeter.",
  },
];

const TIMELINE = [
  {
    year: "10+",
    title: "Years of experience",
    text: "A decade of learning, creating and turning cake ideas into beautiful realities.",
  },
  {
    year: "2,500+",
    title: "Cakes delivered",
    text: "Every cake is made with the same dedication, care and attention to detail.",
  },
  {
    year: "Always",
    title: "A personal touch",
    text: "Because every celebration is unique, every Cake o'clock creation is made just for you.",
  },
];

function About() {
  return (
    <div className="aboutPage">
      <section className="aboutHero">
        <div className="container aboutHeroInner">
          <div className="aboutHeroCopy">
            <p className="eyebrow">Meet our artist</p>
            <h1 className="aboutTitle">
              Meet the artist behind <em>every creation</em>
            </h1>
            <p className="aboutText">
              Udari Ramawickrama is the founder and creative heart behind Cake
              o'clock. With over 10 years of experience, she brings each
              customer’s ideas to life through thoughtful, handcrafted cakes.
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
            <div className="aboutHeroStory">
              <p className="eyebrow">Our story</p>
              <h2 className="section-title">
                Every celebration deserves <em>something special</em>
              </h2>
              <p className="aboutText">
                Our journey began with a simple belief: every celebration
                deserves something special. From birthdays to milestones, we
                create artisan and bespoke cakes with beautiful designs,
                quality ingredients and personal care.
              </p>
              <p className="aboutText">
                More than the cakes we deliver, we cherish the smiles and
                memories behind every order.
              </p>
            </div>
          </div>

          <div className="aboutHeroMedia">
            <img src={AboutImage} alt="Udari Ramawickrama creating a celebration cake" />
            <span className="aboutHeroBadge">
              <strong>10+</strong>
              <span>Years of experience</span>
            </span>
            <div className="aboutHeroStats">
              {TIMELINE.map((entry) => (
                <div key={entry.year} className="aboutHeroStat">
                  <strong>{entry.year}</strong>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
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

      <section className="aboutCta">
        <div className="container aboutCtaInner">
          <img src={HomeImage} alt="" aria-hidden="true" />
          <div className="aboutCtaBody">
            <h2 className="aboutCtaTitle">
              Let’s make your <em>moment sweeter</em>
            </h2>
            <p className="aboutCtaText">
              Have a special idea in mind? We would love to create something
              beautiful for you.
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
