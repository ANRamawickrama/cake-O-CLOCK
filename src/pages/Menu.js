import React from "react";
import birthdaycake from "./birthdaycake";
import { Link } from "react-router-dom";
import BirthdayImage from "../assets/birthday.jpg";
import cupcakeImage from "../assets/cup.jpg";
import AnniversarycakeImage from "../assets/anniversary.jpg";
import JarcakeImage from "../assets/jar.jpg";
import WeddingStructureImage from "../assets/weddingstructure.jpg";
import "../styles/Menu.css";

function Menu() {
  return (
    <div className='menu'>
        <h1 className='menuTitle'>
            Our Cakes
        </h1>
        <div className="menuLists">
  <div className="menuItem">
    <Link to="/birthdaycake">
      <img src={BirthdayImage} alt="Birthday Cake" />
    </Link>
    <p>Birthday Cake</p>
  </div>

  <div className="menuItem">
    <Link to="/cupcake">
      <img src={cupcakeImage} alt="Cup Cake" />
    </Link>
    <p>Cup Cake</p>
  </div>

  <div className="menuItem">
    <Link to="/anniversarycake">
      <img src={AnniversarycakeImage} alt="Anniversary Cake" />
    </Link>
    <p>Anniversary Cake</p>
  </div>

  <div className="menuItem">
    <Link to="/jarcake">
      <img src={JarcakeImage} alt="Jar Cake" />
    </Link>
    <p>Jar Cake</p>
  </div>

  <div className="menuItem">
    <Link to="/weddingStructures">
      <img src={WeddingStructureImage} alt="Wedding Structure" />
    </Link>
    <p>Wedding Structure</p>
  </div>
</div>

    </div>
  )
}

export default Menu;