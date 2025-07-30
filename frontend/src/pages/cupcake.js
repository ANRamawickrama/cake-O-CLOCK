import React from "react";
import  { CupCakes } from "../helpers/CupcakeLists";
import "../styles/Cupcake.css";

function cupcake() {
  return (
    <div className="cupcakePage">
      <h1 className="cupcakeTitle">Choose your design in here...</h1>
            <div className="cupcakeLists">
              {CupCakes.map((cake, index) => (
                <div key={index} className="cakeItem">
                  <img src={cake.image} alt={`Cake ${index + 1}`} />
                  <p>Rs {cake.price}</p>
                </div>
              ))}
            </div>
    </div>
  )
}

export default cupcake;