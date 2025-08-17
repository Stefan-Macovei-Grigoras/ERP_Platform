// components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext'
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary">
        Loading...
      </Typography>
    </Box>
  );
}

function AccessDenied({ userRole, requiredRole }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={3}
      sx={{ p: 3 }}
    >
      <Alert severity="error" sx={{ maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body2">
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Your role: <strong>{userRole}</strong>
        </Typography>
        <Typography variant="body2">
          Required role: <strong>{requiredRole}</strong>
        </Typography>
      </Alert>
    </Box>
  );
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  allowedRoles = null 
}) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    return <AccessDenied userRole={userRole} requiredRole={requiredRole} />;
  }

  // Check if user role is in allowed roles array
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <AccessDenied userRole={userRole} requiredRole={allowedRoles.join(' or ')} />;
  }

  return children;
}