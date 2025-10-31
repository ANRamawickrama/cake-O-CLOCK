import React from "react";
import { Link } from "react-router-dom";
import { weddingStructure } from "../helpers/StructureList";
import "../styles/StructureList.css";

function WeddingStructures() {
  return (
    <div className="structurePage">
      <h1 className="structureTitle">Choose your design in here...</h1>
            <div className="structureLists">
              {weddingStructure.map((cake, index) => (
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
  )
}

export default WeddingStructures;