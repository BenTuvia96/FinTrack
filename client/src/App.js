import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import SignInForm from "./sign_in_form";



function Description() {
  return (
    <div>
    Welcome to Fin Track – your personal gateway to financial clarity.
    <br />
    Let's simplify your money journey together.
    <br />
    Dive in and take control of your finances today!
  </div>
  );
}

function SignInButtons() {
  return (
    <div className="button-container">
      <Link to="/sign_in_form" className="sign_button">Sign In</Link>
      <Link to="/signup" className="sign_button">Sign Up</Link>
    </div>
  );
}

function HomePage() {
  return (
    <div className="App">
      <img src="/White_Logo.svg" alt="logo" className="App-logo" />
      <p className="app_description"><Description /></p>
      <SignInButtons />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign_in_form" element={<SignInForm />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
