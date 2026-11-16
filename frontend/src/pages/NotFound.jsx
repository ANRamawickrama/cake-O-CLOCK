import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="notFoundPage">
      <div className="container notFoundInner">
        <p className="notFoundCode">404</p>
        <h1 className="notFoundTitle">This page has gone out for delivery</h1>
        <p className="notFoundText">
          The page you are looking for does not exist or has moved. Let us get
          you back to something sweet.
        </p>
        <div className="notFoundActions">
          <Link to="/" className="btn btn-primary btn-lg">
            <HomeIcon fontSize="small" />
            Back to home
          </Link>
          <Link to="/menu" className="btn btn-outline btn-lg">
            Browse the menu
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
