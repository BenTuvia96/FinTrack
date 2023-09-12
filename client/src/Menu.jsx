import React from "react";
import "./Menu.css"; // We will create this soon
import { Link } from "react-router-dom";

function Menu({ toggleMenu }) {
  return (
    <div className="side-menu">
      <input type="checkbox" id="menu" onClick={toggleMenu} />
      <label htmlFor="menu" className="icon">
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