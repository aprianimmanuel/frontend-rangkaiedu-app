import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getToken, setToken, logout, decodeToken } from '../utils/auth';

const AuthContext = createContext();

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
      // TEMPORARY: Mock auth for development - remove before production.
      if (process.env.NODE_ENV === 'development') {
        setUser({ role: 'admin', name: 'Dev User' });
        setLoading(false);
        return;
      }

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

  // Check if user has required role(s)
  const hasRole = (requiredRoles) => {
    if (!user || !user.role) return false;
    
    // If requiredRoles is a string, convert to array
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has any of the required roles
    return rolesArray.includes(user.role);
  };

  // Check if user is authenticated and has specific role(s)
  const isAuthorized = (requiredRoles = []) => {
    if (!user) return false;
    
    // If no specific roles required, just check authentication
    if (requiredRoles.length === 0) return true;
    
    return hasRole(requiredRoles);
  };

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logOut,
    isAuthenticated: !!user,
    hasRole,
    isAuthorized,
  }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};