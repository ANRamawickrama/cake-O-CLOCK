import React from "react";
import { Link } from "react-router-dom";
import WeddingCakeImage from "../assets/weddingcake.jpg";

function weddingcake() {
  const weddingCakes = [
    { image: WeddingCakeImage, price: 8000, name: "Wedding Cake" }
  ];

  return (
    <div className="cupcakePage">
      <h1 className="cupcakeTitle">Our Wedding Cakes</h1>
      <div className="cupcakeLists">
        {weddingCakes.map((cake, index) => (
          <div key={index} className="cakeItem">
            <img src={cake.image} alt={`Wedding Cake ${index + 1}`} />
            <p>Rs {cake.price}</p>
            <Link to="/order" state={{ cake: { ...cake, name: `Wedding Cake ${index + 1}` } }}>
              <button>Order</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default weddingcake;