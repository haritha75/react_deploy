import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../media/synergizelogo.png";
import "../css/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-body">
      <div className="landing-page-container">
        <div className="left-side">
          <img src={logo1} alt="Logo" className="landing-page-logo" />
          <p className="landing-page-description">
            WHERE 'EFFICIENCY' <br />
            MEETS
            <br />
            'INGENUITY'
          </p>
        </div>
        <div className="right-side">
          <h1 className="product-name">
            {"SYNERGIZE".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </h1>
          <br />
          <br />
          <Link to="/login">
            <button
              type="button"
              className="btn btn-primary btn-lg custom-button btn-getstarted"
            >
              GET STARTED!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
