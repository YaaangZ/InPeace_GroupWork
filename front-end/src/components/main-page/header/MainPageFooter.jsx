import React from "react";
import './NavBar.css'

const Footer = () => {
    return (
        <footer id='footer'>
        <h4 id='copyright'>copyright @ InPeace 2023</h4>
        <div className="icon">
            <p id='contact'>Contact us</p>
            <div className="email-info" style={{marginBottom: '20px'}}>
                <i className="fas fa-envelope"></i>
                <p>admin@inpeace.ie</p>
            </div>
        </div>
    </footer>)
  }
  
  export default Footer;
