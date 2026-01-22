import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const togglNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const closeMenu = () => {
    setOpenLinks(false);
  };

  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="Logo" onClick={closeMenu} />

        <div className="hiddenLinks">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/menu" onClick={closeMenu}>Menu</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/reviews" onClick={closeMenu}>Reviews</Link>

        </div>
      </div>

      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/reviews">Reviews</Link>

        <button onClick={togglNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
