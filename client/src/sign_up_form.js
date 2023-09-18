// create a sign up form
// Path: client/src/sign_up_form.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign_in_and_up_form.css";
import TopBar from "./top_bar";
import axios, { Axios } from "axios";

// create a sign up form including: email, username and passowrd
function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/addUser", {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
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
              placeholder="example@example.com"
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
          <button className="button" type="submit">
            Sign Up!
          </button>
        </form>
        <p>
          Already signed up? <Link to="/sign_in_form">Sign in!</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
