import axios from 'axios';

const API_BASE_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});


export default api;