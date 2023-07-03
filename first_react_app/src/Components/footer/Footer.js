import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import tatvasoftLogo from "../../images/Tatvasoftlogo.svg";


const Footer = () => {
  return (
    <div style={{marginTop:80}}>
      <footer className="site-footer" id="footer">
        <div className="bottom-footer">
          <div className="container_">
            <div className="text-center">
              <div className="f_logo" >
                <Link to="/" title="logo" className="link_">
                  <img src={tatvasoftLogo} alt="sitelogo" />
                </Link>
              </div>
              <p className="copyright-text">
                © 2015 Tatvasoft.com. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
};
export default Footer;