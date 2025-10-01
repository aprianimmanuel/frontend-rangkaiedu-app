import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/api';
import {
  getToken,
  setToken,
  logout,
  decodeToken,
  isTokenExpired,
  refreshToken,
  shouldRefreshToken
} from '../utils/auth';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = getToken();
        console.log('AuthContext: Token from storage:', token);
        if (token) {
          const decodedUser = decodeToken(token);
          console.log('AuthContext: Decoded user:', decodedUser);
          if (decodedUser) {
            // Handle both possible token structures
            const user = decodedUser.user || decodedUser;
            console.log('AuthContext: User object:', user);
            if (user && user.exp) {
              const expired = isTokenExpired(token);
              console.log('AuthContext: Token expired:', expired);
              if (expired) {
                const refreshed = await refresh();
                console.log('AuthContext: Refresh result:', refreshed);
                if (!refreshed) {
                  setUser(null);
                  setError('Token refresh failed');
                }
              } else {
                setUser(user);
                console.log('AuthContext: Set user:', user);
              }
            } else {
              setUser(user);
              console.log('AuthContext: Set user (no exp):', user);
            }
          } else {
            console.log('AuthContext: No decoded user, logging out');
            handleLogout();
          }
        } else {
          console.log('AuthContext: No token, setting user to null');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication initialization failed');
        setUser(null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };
 
    initAuth();
  }, []);

  // Enhanced login function with better error handling
  const login = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Starting login with token:', token);
      
      if (!token) {
        throw new Error('No token provided');
      }
      
      const decodedUser = decodeToken(token);
      console.log('AuthContext: Decoded user in login:', decodedUser);
      if (!decodedUser) {
        console.log('AuthContext: Invalid token detected in login');
        throw new Error('Invalid token');
      }
      
      // Validate token structure - handle both possible structures
      const user = decodedUser.user || decodedUser;
      if (!user.id || !user.role) {
        throw new Error('Token missing required user information');
      }
      
      setToken(token);
      setUser(user);
      console.log('AuthContext: Login successful, setting user:', user);
      return { success: true, user: user };
    } catch (err) {
      const errorMessage = 'Login failed: ' + (err.message || 'Unknown error');
      console.log('AuthContext: Login error caught:', errorMessage);
      setError(errorMessage);
      handleLogout(true); // Preserve error on login failure
      console.log('AuthContext: Error set in login to:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      console.log('AuthContext: Finally block in login, setting loading to false');
      setLoading(false);
    }
  }, []);

  // Enhanced logout with secure cleanup
  const handleLogout = useCallback((preserveError = false) => {
    setUser(null);
    if (!preserveError) {
      setError(null);
    }
    logout();  // Always called
    // Always call window.location.replace - in tests, it's mocked, so no actual navigation occurs
    if (typeof window !== 'undefined' && window.location) {
      window.location.replace('/login');
    }
  }, []);

  // Enhanced token refresh with better error handling and state management
  const refresh = useCallback(async () => {
    // Prevent multiple concurrent refresh attempts
    if (isRefreshing) {
      // Wait a bit and return current state
      await new Promise(resolve => setTimeout(resolve, 100));
      return !!user;
    }
 
    try {
      console.log('AuthContext: Starting refresh');
      setIsRefreshing(true);
      setError(null);
      
      const newToken = await refreshToken();
      console.log('AuthContext: Refresh token received:', newToken ? 'valid' : 'null');
      const decodedUser = decodeToken(newToken);
      console.log('AuthContext: Decoded user in refresh:', decodedUser);
      
      if (decodedUser) {
        setToken(newToken);
        setUser(decodedUser);
        console.log('AuthContext: Refresh successful, setting user:', decodedUser);
        return true;
      } else {
        console.log('AuthContext: Invalid decoded user after refresh');
        handleLogout();
        return false;
      }
    } catch (err) {
      const errorMessage = 'Token refresh failed: ' + (err.message || 'Unknown error');
      console.log('AuthContext: Refresh error caught:', errorMessage);
      setError(errorMessage);
      handleLogout(true); // Preserve error on refresh failure
      console.log('AuthContext: Error set in refresh to:', errorMessage);
      return false;
    } finally {
      console.log('AuthContext: Finally block in refresh, setting isRefreshing to false');
      setIsRefreshing(false);
    }
  }, [user, isRefreshing, handleLogout]);

  // Check if user has required role(s)
  const hasRole = useCallback((requiredRoles) => {
    if (!user || !user.role) return false;
    
    // If requiredRoles is a string, convert to array
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has any of the required roles
    return rolesArray.includes(user.role);
  }, [user]);

  // Check if user is authenticated and has specific role(s)
  const isAuthorized = useCallback((requiredRoles = []) => {
    if (!user) return false;
    
    // If no specific roles required, just check authentication
    if (requiredRoles.length === 0) return true;
    
    return hasRole(requiredRoles);
  }, [user, hasRole]);

  // Setup axios interceptors for automatic token handling
  useEffect(() => {
    // Request interceptor to add auth token and handle refresh
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        let token = getToken();
        if (token) {
          // Check if token needs refresh before making request
          if (shouldRefreshToken(token)) {
            try {
              const refreshed = await refresh();
              if (refreshed) {
                token = getToken();
              } else {
                token = null;
              }
            } catch (err) {
              console.error('Token refresh failed in interceptor:', err);
              token = null;
            }
          } else if (isTokenExpired(token)) {
            // If token is already expired, try to refresh
            try {
              const refreshed = await refresh();
              if (refreshed) {
                token = getToken();
              } else {
                token = null;
              }
            } catch (err) {
              console.error('Token refresh failed in interceptor:', err);
              token = null;
            }
          }
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized responses
        if (error && error?.response?.status === 401) {
          try {
            // Explicitly clear auth state before calling handleLogout
            // This ensures state is updated immediately for tests
            setUser(null);
            setError(null);
            handleLogout();
          } catch (logoutError) {
            console.error('Error during 401 logout handling:', logoutError);
            // Ensure state is cleared even if logout fails
            setUser(null);
            setError(null);
            logout(); // Fallback to basic logout
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refresh, handleLogout]);

  // Periodic token refresh check
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const token = getToken();
      if (token && shouldRefreshToken(token)) {
        refresh();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, refresh]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logOut: handleLogout,
    refresh,
    isAuthenticated: !!user,
    hasRole,
    isAuthorized,
  }), [user, loading, error, login, handleLogout, refresh, hasRole, isAuthorized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};