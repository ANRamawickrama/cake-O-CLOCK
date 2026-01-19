import React from "react";
import { Link } from "react-router-dom";
import JarCakeImage from "../assets/jar.jpg";

function jarcake() {
  const jarCakes = [
    { image: JarCakeImage, price: 1500, name: "Jar Cake" }
  ];

  return (
    <div className="cupcakePage">
      <h1 className="cupcakeTitle">Our Jar Cakes</h1>
      <div className="cupcakeLists">
        {jarCakes.map((cake, index) => (
          <div key={index} className="cakeItem">
            <img src={cake.image} alt={`Jar Cake ${index + 1}`} />
            <p>Rs {cake.price}</p>
            <Link to="/order" state={{ cake: { ...cake, name: `Jar Cake ${index + 1}` } }}>
              <button>Order</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default jarcake;