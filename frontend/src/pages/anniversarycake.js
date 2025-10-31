import React from "react";
import { Link } from "react-router-dom";
import { AnniversaryCakes } from "../helpers/AnniversaryList";
import "../styles/AnniversaryList.css";

function AnniversaryCake() {
  return (
    <div className="anniversaryPage">
      <h1 className="anniversaryTitle">Choose your design in here...</h1>
      <div className="anniversaryLists">
        {AnniversaryCakes.map((cake, index) => (
          <div key={index} className="cakeItem">
            <img src={cake.image} alt={`Cake ${index + 1}`} />
            <p>Rs {cake.price}</p>
            <Link to="/order ">
              <button>Order</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnniversaryCake;
