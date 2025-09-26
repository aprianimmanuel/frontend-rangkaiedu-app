import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock for testing (backend off)
const originalPost = api.post;
api.post = async (url, data) => {
  if (url.includes('/auth/whatsapp-otp/send')) {
    console.log('Mock: Sending OTP to', data.phone);
    return { data: { success: true } };
  }
  if (url.includes('/auth/whatsapp-otp/verify')) {
    console.log('Mock: Verifying OTP for', data.phone);
    return { data: { token: 'mock-jwt-token', user: { role: 'guru', id: 1, name: 'Test User' } } };
  }
  if (url.includes('/auth/google') || url.includes('/auth/apple')) {
    console.log('Mock: Social login success');
    return { data: { token: 'mock-social-token', user: { role: 'ortu', id: 2, name: 'Social User' } } };
  }
  if (url.includes('/auth/verify-role')) {
    console.log('Mock: Verifying role', data.role);
    return { data: { success: true } };
  }
  // Fallback to real API (will 404)
  return originalPost(url, data);
};

export default api;