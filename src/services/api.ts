import axios from 'axios';

// Reusable Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fastcard-1-o23z.onrender.com/api',
  timeout: 30000, // increased for cold starts on render
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization headers (e.g. from Redux/localStorage)
api.interceptors.request.use(
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

export default api;
