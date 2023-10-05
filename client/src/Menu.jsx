import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Menu.css";

function Menu({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const signOut = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className={`side-menu ${theme}`}>
      <label className="icon">
        <div className="menu"></div>
      </label>
      <nav>
        <ul>
          <li className={isActive("/profile")}>
            <i className="material-icons">person</i>Profile
          </li>
          <Link to="/dashboard">
            <li className={isActive("/dashboard")}>
              <i className="material-icons">wallet</i>Dashboard
            </li>
          </Link>
          <Link to="/transactions">
            <li className={isActive("/transactions")}>
              <i className="material-icons">paid</i>Transactions{" "}
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
