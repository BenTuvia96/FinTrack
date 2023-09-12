import "./Menu.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";

function Menu({ theme }) {

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
