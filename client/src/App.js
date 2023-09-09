import "./App.css";

function App() {
  const app_description = (
    <div>
      Welcome to Fin Track – your personal gateway to financial clarity.
      <br />
      Let's simplify your money journey together.
      <br />
      Dive in and take control of your finances today!
    </div>
  );
  return (
    <div className="App">
    <img src="/White_Logo.svg" alt="logo" className="App-logo" />
      <p className="app_description">{app_description}</p>
      <div className="button-container">
        <button className="sign_button">Sign In</button>
        <button className="sign_button">Sign Out</button>
      </div>
    </div>
  );
}

export default App;
