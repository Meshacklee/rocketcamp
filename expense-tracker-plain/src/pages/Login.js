// src/pages/Login.js (Example - adjust Register.js similarly)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="form-container auth-form-container"> {/* Apply container and auth-specific class */}
      <h2 className="form-title">Login</h2> {/* Apply title class */}
      <form onSubmit={handleSubmit}>
        <div className="form-group"> {/* Apply group class */}
          <label>Email</label>
          <input
            type="email"
            className="input" // Apply input class
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Apply group class */}
          <label>Password</label>
          <input
            type="password"
            className="input" // Apply input class
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button> {/* Apply button classes */}
      </form>
      <p className="mt-4 text-center"> {/* Add some spacing and center text if needed */}
        Don't have an account? <button onClick={() => navigate('/register')} className="text-blue-500 hover:underline">Register</button>
      </p>
    </div>
  );
};

export default Login;
