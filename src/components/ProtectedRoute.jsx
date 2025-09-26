import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // TEMPORARY: Disabled auth checks for development - re-enable before production.
  // FIXED: Use {children} instead of <Outlet /> for direct child rendering in non-nested routes.
  return children;
};

export default ProtectedRoute;