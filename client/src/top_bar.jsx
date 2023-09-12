import React from "react";
import "./top_bar.css";
import { Link } from "react-router-dom";

function TopBar({ header }) {
  return (
    <div className="top_bar">
      <div className="left_section">
        <Link to="/">
          <img src="/white_logo.svg" alt="App Logo" className="app_logo" />
        </Link>
      </div>
      <div className="center_section">
        <h1>{header}</h1>
      </div>
      <div className="right_section">
        {/* Add any component or element you want on the right side if needed */}
      </div>
    </div>
  );
}

export default TopBar;
