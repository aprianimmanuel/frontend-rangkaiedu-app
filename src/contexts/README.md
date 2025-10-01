# Authentication System

This document provides an overview of the authentication system implementation in the Rangkai Edu frontend application.

## Overview

The authentication system is built using React Context API to provide global authentication state management. It includes:

1. **AuthContext** - Global context for authentication state
2. **Auth Utilities** - Helper functions for token management
3. **ProtectedRoute** - Component for protecting routes based on authentication status

## Key Features

### 1. Secure Token Storage
- Tokens are stored in both localStorage and sessionStorage for persistence and security
- Automatic cleanup of sensitive data on logout

### 2. Automatic Token Refresh
- Proactive token refresh before expiration (15-minute buffer)
- Periodic checks for token expiration
- Axios interceptors for automatic token refresh on API requests

### 3. Token Validation
- JWT token decoding and validation
- Expiration checking with buffer time to account for network delays
- Automatic logout on token expiration

### 4. Role-Based Authorization
- Role checking functions (`hasRole`, `isAuthorized`)
- Integration with ProtectedRoute component for route protection

## Implementation Details

### AuthContext.jsx

The main authentication context that provides:

- `user` - Current user object
- `loading` - Loading state
- `error` - Error messages
- `login` - Function to log in with a token
- `logOut` - Function to log out and clear auth state
- `refresh` - Function to manually refresh the token
- `isAuthenticated` - Boolean indicating if user is authenticated
- `hasRole` - Function to check if user has specific role(s)
- `isAuthorized` - Function to check if user is authorized for specific roles

### auth.js

Utility functions for authentication:

- `setToken` - Securely store token in localStorage and sessionStorage
- `getToken` - Retrieve token from storage (prefers sessionStorage)
- `logout` - Securely remove token and sensitive data from storage
- `decodeToken` - Decode JWT token payload
- `isTokenExpired` - Check if token is expired (with 5-minute buffer)
- `isTokenExpiringSoon` - Check if token expires within 15 minutes
- `refreshToken` - Refresh token (currently simulated)
- `shouldRefreshToken` - Check if token should be refreshed

### ProtectedRoute.jsx

Component for protecting routes:

- Redirects unauthenticated users to login page
- Displays error for unauthorized role access
- Shows loading spinner during authentication checks

## Usage Examples

### Using AuthContext in Components

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};
```

### Protecting Routes

```jsx
// In App.jsx or routing component
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredRole="admin">
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Checking Roles

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { hasRole, isAuthorized } = useAuth();
  
  // Check for specific role
  if (hasRole('admin')) {
    // Show admin features
  }
  
  // Check for multiple possible roles
  if (isAuthorized(['teacher', 'admin'])) {
    // Show features for teachers or admins
  }
};
```

## Security Considerations

1. **Token Storage**: Tokens are stored in both localStorage and sessionStorage. While this provides some additional security, it's still vulnerable to XSS attacks. In production, consider using httpOnly cookies.

2. **Token Expiration**: Tokens are checked for expiration with a buffer time to prevent issues with network delays.

3. **Automatic Cleanup**: On logout, all sensitive data is removed from storage.

4. **Secure Communication**: All API requests should be made over HTTPS to prevent token interception.

## Future Improvements

1. **Backend Refresh Endpoint**: Implement a real token refresh endpoint in the backend
2. **Enhanced Security**: Consider using httpOnly cookies for token storage
3. **Multi-factor Authentication**: Add support for MFA
4. **Session Management**: Implement session management across multiple tabs/windows