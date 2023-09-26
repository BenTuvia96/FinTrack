import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const signOut = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Optionally, clear any user-specific state data here

    navigate("/");
  };

  return (
    <div className={`side-menu ${theme}`}>
      <label className="icon">
        <div className="menu"></div>
      </label>
      <nav>
        <ul>
          <li>
            <i className="material-icons">person</i>Profile
          </li>
          <Link to="/dashboard">
            <li>
              <i className="material-icons">wallet</i>Dashboard
            </li>
          </Link>
          <Link to="/transactions">
            <li>
              <i className="material-icons">paid</i>Transactions{" "}
              {/* TODO: change to transactions page*/}
            </li>
          </Link>
          <li onClick={toggleTheme}>
            <i className="material-icons">
              {theme === "dark" ? "brightness_high" : "brightness_low"}
            </i>
            Toggle Theme
          </li>
          <li>
            <i className="material-icons">settings</i>Settings
          </li>
          <li onClick={signOut}>
            <i className="material-icons">logout</i>Sign Out
          </li>{" "}
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
