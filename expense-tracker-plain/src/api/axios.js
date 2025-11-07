// src/api/axios.js (in your frontend project)
import axios from 'axios';

// Change this URL to your deployed backend URL
const API_BASE_URL = 'https://rocketcamp.onrender.com/api'; // <-- Update this line

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally if needed
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;