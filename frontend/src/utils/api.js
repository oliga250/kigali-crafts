import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kigali-crafts-backend.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, '')}/api`,
  withCredentials: false
});

export default api;