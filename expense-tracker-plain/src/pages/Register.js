// src/pages/Register.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password state
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await register(email, password);
      alert('Registration successful! Please check your email to confirm.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="form-container auth-form-container"> {/* Apply container and auth-specific class */}
      <h2 className="form-title">Register</h2> {/* Apply title class */}
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
        <div className="form-group"> {/* Apply group class */}
          <label>Confirm Password</label>
          <input
            type="password"
            className="input" // Apply input class
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Register</button> {/* Apply button classes, make full width */}
      </form>
      <p className="mt-4 text-center"> {/* Add some spacing and center text */}
        Already have an account? <button onClick={() => navigate('/login')} className="form-link">Login</button> {/* Use link style */}
      </p>
    </div>
  );
};

export default Register;
