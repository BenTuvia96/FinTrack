import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
  useNavigate, // Importing the useNavigate hook
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
  const token = localStorage.getItem("token");

  return (
    <div>
      {token ? (
        <div className="sign-in-container">
          <Link className="button" to="/dashboard">
            Continue
          </Link>
        </div>
      ) : (
        <div className="sign-in-container">
          <Link to="/sign_in_form" className="button">
            Sign In
          </Link>
          <Link to="/sign_up_form" className="button">
            Sign Up
          </Link>
        </div>
      )}
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
function MainContent({ setLocation, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate(); // Use the navigate function here

  // Notify the App about the current location
  useEffect(() => {
    setLocation(location.pathname);

    // Add keyboard shortcut listener
    const handleKeyDown = (event) => {
      if (document.activeElement.tagName === "INPUT") {
        return; // Do nothing if an input field is focused
      }
      if (event.shiftKey && event.key === "D") {
        navigate("/dashboard");
      }
      if (event.shiftKey && event.key === "A") {
        navigate("/transactions");
      }
      if (event.shiftKey && event.key === "I") {
        navigate("/sign_in_form");
      }
      if (event.shiftKey && event.key === "U") {
        navigate("/sign_up_form");
      }
      if (event.shiftKey && event.key === "M") {
        navigate("/");
      }
      if (event.shiftKey && event.key === "Q") {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [location, setLocation, navigate, toggleTheme]); // Added navigate to the dependency list

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
    // Existing theme change code
    document.body.classList.remove("light", "dark");
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <Router>
        {currentLocation !== "/" && (
          <Menu theme={currentTheme} toggleTheme={toggleTheme} />
        )}
        <MainContent
          setLocation={setCurrentLocation}
          toggleTheme={toggleTheme}
        />
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
