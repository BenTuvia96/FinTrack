import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign_in_and_up_form.css";
import TopBar from "./top_bar";
import axios from "axios";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Store the JWT token in local storage or a cookie
        localStorage.setItem("token", response.data.token);

        // Navigate to the dashboard or another protected route
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        // Handle any errors, such as displaying a message to the user
      });
  };

  return (
    <div className="page_container">
      <TopBar />
      <div className="form_container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button" type="submit">
            Sign In
          </button>
        </form>
        <p>
          New to Fin Track? <Link to="/sign_up_form">Sign up now</Link>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
