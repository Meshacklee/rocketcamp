// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Define default currency and available currencies
const DEFAULT_CURRENCY_KEY = 'defaultCurrency';
const DEFAULT_CURRENCY = 'USD';
const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'SGD'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // State for default currency
  const [defaultCurrency, setDefaultCurrencyState] = useState(DEFAULT_CURRENCY);

  // Load user and default currency from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const savedDefaultCurrency = localStorage.getItem(DEFAULT_CURRENCY_KEY) || DEFAULT_CURRENCY;

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    // Set the state variable to the value from localStorage (or default)
    setDefaultCurrencyState(savedDefaultCurrency);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await API.post('/auth/register', { email, password });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally, keep default currency on logout
    // localStorage.removeItem(DEFAULT_CURRENCY_KEY);
    setUser(null);
  };

  // Function to get the default currency
  const getDefaultCurrency = () => {
    return defaultCurrency;
  };

  // Function to set the default currency
  const setDefaultCurrency = (currencyCode) => {
    if (AVAILABLE_CURRENCIES.includes(currencyCode)) {
      setDefaultCurrencyState(currencyCode); // Update the React state
      localStorage.setItem(DEFAULT_CURRENCY_KEY, currencyCode); // Persist in localStorage
      console.log(`Default currency set to: ${currencyCode}`); // Optional: log for confirmation
    } else {
      console.warn(`Invalid currency code: ${currencyCode}. Not setting default.`);
    }
  };

  // Provide the state, functions, and default currency to components
  // IMPORTANT: Include setDefaultCurrency in the value object
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, defaultCurrency, setDefaultCurrency, getDefaultCurrency }}>
      {children}
    </AuthContext.Provider>
  );
};
