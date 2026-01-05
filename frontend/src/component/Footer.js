import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import "../styles/Footer.css";

function Footer() {
  return (
    <div className='footer'>
      <div className='socialMedia'>
        <FacebookIcon />
        <InstagramIcon />
      </div>
      <div className='contact-section'>
        <p className='contact-text'>
          📞 Call us: <a href="tel:+947710961790" className="footer-phone">+94 77 109 61790</a>
        </p>
      </div>
      <p>&copy; 2020 cake'o clock.com</p>
    </div>
  )
}

export default Footer;