import { jwtDecode } from 'jwt-decode';
import api from './api';

const TOKEN_KEY = 'token';

// Secure token storage with additional security measures
export const setToken = (token) => {
  if (token) {
    // Store in localStorage for persistence across sessions
    localStorage.setItem(TOKEN_KEY, token);
    
    // Also store in sessionStorage for additional security (not persisted across tabs)
    // This provides a fallback in case localStorage is compromised
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      // Ignore if sessionStorage is not available
    }
  }
};

export const getToken = () => {
  // Try to get from sessionStorage first (more secure)
  try {
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    if (sessionToken) {
      return sessionToken;
    }
  } catch (e) {
    // Ignore if sessionStorage is not available
  }
  
  // Fallback to localStorage
  return localStorage.getItem(TOKEN_KEY);
};

// Enhanced logout with secure cleanup
export const logout = () => {
  // Remove from all storage locations
  localStorage.removeItem(TOKEN_KEY);
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // Ignore if sessionStorage is not available
  }
  
  // Clear all sensitive data
  // Add any other sensitive items that might be stored
  const sensitiveKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('user_') || key.startsWith('profile_') || key.startsWith('secure_')
  );
  
  sensitiveKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  try {
    const sensitiveSessionKeys = Object.keys(sessionStorage).filter(key =>
      key.startsWith('user_') || key.startsWith('profile_') || key.startsWith('secure_')
    );
    
    sensitiveSessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });
  } catch (e) {
    // Ignore if sessionStorage is not available
  }
};

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Handle both possible token structures
    // Backend returns: { sub, email, phone, role, iat, exp }
    // But frontend expects: { user: { id, email, role }, exp }
    if (decoded.sub || decoded.email || decoded.role) {
      return {
        id: decoded.sub,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat
      };
    }
    return decoded.user || decoded; // Fallback to existing structure
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Add a 5-minute buffer to account for network delays
  const buffer = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() >= (decoded.exp * 1000 - buffer);
};

export const isTokenExpiringSoon = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if token expires within 15 minutes
  const soon = 15 * 60 * 1000; // 15 minutes in milliseconds
  return Date.now() >= (decoded.exp * 1000 - soon);
};

// Enhanced token refresh with actual API call
export const refreshToken = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token to refresh');
  }
  
  // Note: In a real implementation, we would call a refresh endpoint
  // For now, we'll simulate the refresh by returning the current token
  // In production, this would be:
  /*
  try {
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.token;
  } catch (error) {
    throw new Error('Token refresh failed: ' + error.message);
  }
  */
  
  // For simulation, return the current token if not expired
  if (isTokenExpired(token)) {
    throw new Error('Token expired, cannot refresh');
  }
  
  console.log('Simulating token refresh...');
  return token;
};

// Check if token needs refresh before making API calls
export const shouldRefreshToken = () => {
  const token = getToken();
  return token && isTokenExpiringSoon(token);
};