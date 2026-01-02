import React from "react";
import { Link } from "react-router-dom";
import { BirthdayCakes } from "../helpers/BirthdayLists";
import "../styles/BirthdayList.css";

function BirthdayCake() {
  return (
    <div className="birthdayPage">
      <h1 className="birthdayTitle">Choose your design in here...</h1>

      <div className="birthdayLists">
        {BirthdayCakes.map((cake, index) => (
          <div key={index} className="cakeItem">
            <img src={cake.image} alt={`Cake ${index + 1}`} />
            <p>Rs {cake.price}</p>
            <Link to="/order"> 
                <button>Order</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BirthdayCake;
