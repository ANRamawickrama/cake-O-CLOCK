import React from"react";
import scake from "../assets/about.jpg";
import "../styles/About.css"

function About() {
  return (
    <div className="about">
        <div className="aboutTop" 
        style={{ backgroundImage: `url(${scake})` }}
        >
        </div>
        <div className="aboutBottom">
            <h1>Always in Good Taste!</h1>
            <p>At Divine, it's our mission to bring you the largest selection of cakes and other great quality desserts on the market. Along with a vast wealth of
            knowledge in the products we sell, Divine carries everything you could possibly imagine and more. We're here for our customers, and want
            each one of them to have a unique, one-of-a-kind experience at our amazing Cake Shop.</p>
        </div>
    </div>
  )
}

export default About;