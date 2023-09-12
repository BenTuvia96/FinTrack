import "./Menu.css";
import { Link } from "react-router-dom";
import React from "react";

function Menu({ theme, toggleTheme }) {
  return (
    <div className={`side-menu ${theme}`}>
      <label className="icon">
        <div className="menu"></div>
      </label>
      <nav>
        <ul>
          <li>
            <i class="material-icons">person</i>Profile
          </li>
          <Link to="/dashboard">
            <li>
              <i className="material-icons">wallet</i>Dashboard
            </li>
          </Link>
          <li>
            <i class="material-icons">search</i>Search
          </li>
          <li onClick={toggleTheme}>
            <i className="material-icons">
              {theme === "dark" ? "brightness_high" : "brightness_low"}
            </i>
            Toggle Theme
          </li>
          <li>
            <i class="material-icons">settings</i>Settings
          </li>
          <li>
            <i class="material-icons">logout</i>Sign Out
          </li>{" "}
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
