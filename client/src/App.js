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
import Menu from "./Menu";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./transitions.css";

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

function MainContent({ isMenuOpen, setLocation }) {
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
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

const routeThemes = {
  // Side menu themes for each route. If not specified, the default theme is "light"
  "/dashboard": "dark"
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("/");

  const currentTheme = routeThemes[currentLocation] || "light";

  return (
    <Router>
      {currentLocation !== "/" && <Menu theme={currentTheme} />}
      <MainContent isMenuOpen={isMenuOpen} setLocation={setCurrentLocation} />
    </Router>
  );
}
export default App;
