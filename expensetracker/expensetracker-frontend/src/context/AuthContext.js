// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('profile'))?.token;
    if (token) {
      setUser(JSON.parse(localStorage.getItem('profile')));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('profile', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (email, password) => {
    await API.post('/auth/register', { email, password });
  };

  const logout = () => {
    localStorage.removeItem('profile');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};