// create a sign up form
// Path: client/src/sign_up_form.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sign_in_and_up_form.css";
import TopBar from "./top_bar";

// create a sign up form including: email, username and passowrd
function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // Handle sign-in logic here (e.g., call an API)
  };

  return (
    <div className="page_container">
      <TopBar />
      <div className="form_container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
          <div className="form_group">
            <label htmlFor="username">Username:</label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button className="button" type="submit">Sign Up!</button>
        </form>
        <p>
          Already signed up? <Link to="/sign_in_form">Sign in!</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
