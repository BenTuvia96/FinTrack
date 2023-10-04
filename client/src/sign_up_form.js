import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign_in_and_up_form.css";
import TopBar from "./top_bar";
import axios from "axios";

// create a sign up form including: email, username and passowrd
function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

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
        navigate("/sign_in_form");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  const validateEmail = () => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setEmailError("Invalid email");
    } else {
      setEmailError(""); // Clear the error when email is valid
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("at least 6 characters required");
    } else {
      setPasswordError(""); // Clear the error when password is valid
    }
  };

  const validateUsername = async () => {
    try {
      const response = await axios.post("http://localhost:3001/checkUsername", {
        username: username,
      });

      if (response.data.error) {
        // Username is already in use
        setUsernameError("Username is already taken");
      } else {
        // Username is available
        setUsernameError("");
      }
    } catch (error) {
      console.error("Error during username validation:", error);
    }
  };

  return (
    <div className="page_container">
      <TopBar />
      <div className="form_container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form_group">
            {/* TODO: remove our verification? we already have html built in verification with the input tag type and minLength parameters */}
            <label htmlFor="email">Email:</label>
            <input
              type="email" //TODO: make verification suit DB verificaion (.com stuff)
              placeholder="example@example.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail} // Add onBlur event
              required={true}
            />
            <div className={`validation_message ${emailError ? "show" : ""}`}>
              {emailError}
            </div>
          </div>
          <div className="form_group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword} // Add onBlur event
              minLength="6"
              required={true}
            />
            <div
              className={`validation_message ${passwordError ? "show" : ""}`}
            >
              {passwordError}
            </div>
          </div>
          <div className="form_group">
            <label htmlFor="username">Username:</label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={validateUsername} // Add onBlur event for username validation
              required={true}
            />
            <div
              className={`validation_message ${usernameError ? "show" : ""}`}
            >
              {usernameError}
            </div>
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
