import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';

/**
 * ProtectedRoute component for protecting routes based on authentication and role authorization.
 *
 * This component wraps protected routes and performs authentication and authorization checks.
 * If the user is not authenticated, redirects to /login preserving the attempted path.
 * If required roles are specified and the user does not have any of those roles, displays an unauthorized error message.
 * During loading (e.g., initial auth check), shows a centered spinner.
 *
 * @param {React.ReactNode} children - The JSX element(s) to render if the user is authorized.
 * @param {string|string[]} [requiredRoles] - Optional required role(s) for authorization. Can be a string or array of strings.
 *                                           Supported roles: 'student', 'parent', 'guru', 'admin'.
 *                                           If not provided, only authentication is checked.
 *
 * Example usage in routing (e.g., App.jsx):
 * <Route
 *   path="/dashboard/siswa"
 *   element={
 *     <ProtectedRoute requiredRoles="student">
 *       <DashboardSiswa />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * For routes requiring multiple possible roles:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute requiredRoles={['guru', 'admin']}>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * For routes without role requirement:
 * <Route
 *   path="/profile"
 *   element={
 *     <ProtectedRoute>
 *       <Profile />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * For routes with multiple required roles (user must have ALL specified roles):
 * <Route
 *   path="/admin/settings"
 *   element={
 *     <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles={true}>
 *       <Settings />
 *     </ProtectedRoute>
 *   }
 * />
 */

const ProtectedRoute = ({ children, requiredRoles, requireAllRoles = false }) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location, message: 'Please log in to access this page.' }} replace />
    );
  }

  // Check role-based authorization if requiredRoles is specified
  if (requiredRoles) {
    let isAuthorized = false;
    
    // Handle array of roles
    if (Array.isArray(requiredRoles)) {
      if (requireAllRoles) {
        // User must have ALL specified roles
        isAuthorized = requiredRoles.every(role => hasRole(role));
      } else {
        // User must have at least ONE of the specified roles
        isAuthorized = requiredRoles.some(role => hasRole(role));
      }
    } else {
      // Handle single role as string
      isAuthorized = hasRole(requiredRoles);
    }
    
    // Display error for unauthorized access
    if (!isAuthorized) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          padding={2}
          textAlign="center"
          data-testid="unauthorized-access"
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{ maxWidth: 400, width: '100%' }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body2" paragraph>
              You do not have the required permissions to access this page.
            </Typography>
            <Typography variant="body2" paragraph>
              {Array.isArray(requiredRoles)
                ? `Required roles: ${requiredRoles.join(', ')}`
                : `Required role: ${requiredRoles}`}
            </Typography>
            <Typography variant="body2">
              Your current role: {user?.role || 'Unknown'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Please log in with an account that has the appropriate role.
            </Typography>
          </Alert>
        </Box>
      );
    }
  }

  // User is authenticated and authorized (or no role required), render children
  return children;
};

export default ProtectedRoute;