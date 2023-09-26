import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import SignInForm from "./sign_in_form";
import SignUpForm from "./sign_up_form";
import Dashboard from "./dashboard";
import Transactions from "./transactions";
import Menu from "./Menu";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./transitions.css";
import ThemeContext from "./ThemeContext";

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
      <Link to="/sign_in_form" className="button">
        Sign In
      </Link>
      <Link to="/sign_up_form" className="button">
        Sign Up
      </Link>
    </div>
  );
}

function HomePage() {
  return (
    <div className="App">
      <img src="/White_Logo.svg" alt="logo" className="App-logo" />
      <p className="app_description">
        <Description />
      </p>
      <SignInButtons />
    </div>
  );
}

function MainContent({ setLocation }) {
  const location = useLocation();

  // Notify the App about the current location
  useEffect(() => {
    setLocation(location.pathname);
  }, [location, setLocation]);

  return (
    <div className="app-content">
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes>
            <Route path="/sign_in_form" element={<SignInForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/sign_up_form" element={<SignUpForm />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

function App() {
  const [currentLocation, setCurrentLocation] = useState("/");
  const [theme, setTheme] = useState("light");

  const currentTheme = theme;

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    // This will run every time the theme changes
    document.body.classList.remove("light", "dark"); // Remove both to ensure no overlap
    document.body.classList.add(currentTheme); // Add the current theme
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <Router>
        {currentLocation !== "/" && (
          <Menu theme={currentTheme} toggleTheme={toggleTheme} />
        )}
        <MainContent setLocation={setCurrentLocation} />
      </Router>
    </ThemeContext.Provider>
  );
}
export default App;
