import { Menu } from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import BannerImage from "../assets/home.jpg";
import "../styles/Home.css" ;

function home() {
  return (
    <div className="home">
      <div className="headerContainer"
       style={{backgroundImage: 'url(${BannerImage})'}}>
        <h1>CAKE'O CLOCK</h1>
        <Link to="/menu">
          <button>ORDER NOW</button>
        </Link>
      </div>
    </div>
  )
}

export default home;