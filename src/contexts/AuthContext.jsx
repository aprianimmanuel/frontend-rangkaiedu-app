import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, logout, decodeToken } from '../utils/auth';

const AuthContext = createContext();

console.log('AuthContext module loaded');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      setLoading(true);
      const token = getToken();
      if (token) {
        const decodedUser = decodeToken(token);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    console.log('useAuth exported:', typeof useAuth);

    initAuth();
  }, []);

  const login = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const decodedUser = decodeToken(token);
      if (!decodedUser) {
        throw new Error('Invalid token');
      }
      setToken(token);
      setUser(decodedUser);
      setLoading(false);
    } catch (err) {
      setError('Login failed: ' + err.message);
      setLoading(false);
    }
  };

  const logOut = () => {
    setUser(null);
    setError(null);
    logout();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

console.log('AuthProvider rendered');