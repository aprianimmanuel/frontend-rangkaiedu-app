# ProtectedRoute Component

The `ProtectedRoute` component is used to protect routes in the application based on authentication status and role authorization.

## Overview

This component wraps protected routes and performs authentication and authorization checks:
- If the user is not authenticated, redirects to `/login` preserving the attempted path
- If required roles are specified and the user does not have the required role(s), displays an unauthorized error message
- During loading (e.g., initial auth check), shows a centered spinner

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | The JSX element(s) to render if the user is authorized |
| requiredRoles | string \| string[] | No | Optional required role(s) for authorization. Can be a string or array of strings |
| requireAllRoles | boolean | No | If true and requiredRoles is an array, user must have ALL specified roles. If false, user must have at least ONE of the specified roles. Defaults to false |

## Usage Examples

### Basic Authentication Protection

```jsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Protection (Single Role)

```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRoles="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Protection (Multiple Roles - Any Match)

```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredRoles={['guru', 'admin']}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Protection (Multiple Roles - All Required)

```jsx
<Route 
  path="/admin/settings" 
  element={
    <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles={true}>
      <SettingsPage />
    </ProtectedRoute>
  } 
/>
```

## Supported Roles

The application supports the following user roles:
- `student` - Student users
- `parent` - Parent users
- `guru` - Teacher users
- `admin` - Administrator users

## Features

### Authentication Check
- Automatically checks if the user is authenticated before rendering protected content
- Redirects unauthenticated users to the login page with a message

### Role-Based Authorization
- Supports single role requirements
- Supports multiple role requirements (any match or all required)
- Displays clear error messages for unauthorized access

### Loading States
- Shows a loading spinner with message during authentication checks
- Provides visual feedback to users during the verification process

### Error Handling
- Displays user-friendly error messages for authorization failures
- Shows the required roles and user's current role for transparency
- Maintains accessibility standards with proper ARIA attributes

## Implementation Details

The component uses the `useAuth` hook from the `AuthContext` to access authentication state and functions:
- `isAuthenticated` - Boolean indicating if user is authenticated
- `loading` - Loading state during authentication checks
- `hasRole` - Function to check if user has specific role(s)
- `user` - Current user object containing role information

The component integrates with React Router's `Navigate` component for redirects and Material-UI components for UI elements.