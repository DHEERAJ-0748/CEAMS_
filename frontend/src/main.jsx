import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set the API base URL from environment variable.
// In production (Vercel), VITE_API_URL points to the Render backend.
// In local dev, it's empty so the Vite proxy handles /api requests.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Setup Axios Interceptor for Auth Token
axios.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
