import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./sign_in_form.css"

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here (e.g., call an API)
  };

  return (
    <div className='form_container'>
      <img src="/white_logo.svg" alt="App Logo" className="app_logo" />
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
        <button type="submit">Sign In</button>
      </form>
      <p>New to Fin Track? <Link to="/sign_up_form">Sign up now</Link></p>
    </div>
  );
}

export default SignInForm;