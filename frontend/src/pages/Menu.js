import React from "react";
import { Link } from "react-router-dom";
import BirthdayImage from "../assets/birthday.jpg";
import cupcakeImage from "../assets/cup.jpg";
import AnniversarycakeImage from "../assets/anniversary.jpg";
import JarcakeImage from "../assets/jar.jpg";
import WeddingStructureImage from "../assets/weddingstructure.jpg";
import WeddingcakeImage from "../assets/weddingcake.jpg"
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
            <p>Birthday Cakes</p>
          </div>

          <div className="menuItem">
            <Link to="/cupcake">
              <img src={cupcakeImage} alt="Cup Cake" />
            </Link>
            <p>Cup Cakes</p>
          </div>

          <div className="menuItem">
            <Link to="/anniversarycake">
              <img src={AnniversarycakeImage} alt="Anniversary Cake" />
            </Link>
            <p>Anniversary Cakes</p>
          </div>

          <div className="menuItem">
            <Link to="/jarcake">
              <img src={JarcakeImage} alt="Jar Cake" />
            </Link>
            <p>Jar Cakes</p>
          </div>

          <div className="menuItem">
            <Link to="/weddingStructures">
              <img src={WeddingStructureImage} alt="Wedding Structure" />
            </Link>
            <p>Wedding Structures</p>
          </div>

          <div className="menuItem">
            <Link to="/weddingcakes">
              <img src={WeddingcakeImage} alt="Wedding Cake" />
            </Link>
            <p>Wedding Cakes</p>
          </div>
        </div>
    </div>
  )
}

export default Menu;