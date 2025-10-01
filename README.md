# Rangkai Edu Frontend

This is the frontend application for the Rangkai Edu platform, built with React and Vite.

## Project Structure

```
frontend-app/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, icons, and other assets
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── locales/         # Internationalization files
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── .env                 # Default environment variables
├── .env.development     # Development environment variables
├── .env.staging         # Staging environment variables
├── .env.production      # Production environment variables
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Environment Variables

The application uses environment variables for configuration. The following variables are available:

- `VITE_BACKEND_URL` - The URL of the backend API
- `VITE_APP_ENV` - The current environment (development, staging, production)

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be output to the `dist` directory.

## Deployment

The application can be deployed to any static hosting service. The `dist` directory contains all the necessary files for deployment.

## Aliases

The following path aliases are configured for easier imports:

- `@` - src directory
- `@components` - src/components directory
- `@pages` - src/pages directory
- `@utils` - src/utils directory
- `@contexts` - src/contexts directory
- `@assets` - src/assets directory

## Authentication Setup and Usage

This section covers the authentication features implemented in the frontend, including state management with AuthContext, route protection with ProtectedRoute, JWT handling, and best practices.

### How to use the AuthContext for authentication state management

The `AuthContext` provides a centralized way to manage authentication state across the application. It handles user data, authentication status, login/logout operations, and JWT token persistence.

- **Wrapping the App with AuthProvider**: To make the auth context available throughout the app, wrap your root component with the `AuthProvider`. This is done in `src/App.jsx`.

  ```jsx
  // src/App.jsx
  import React from 'react';
  import { ThemeProvider } from '@mui/material/styles';
  import CssBaseline from '@mui/material/CssBaseline';
  import { AuthProvider } from './contexts/AuthContext';
  import { GoogleOAuthProvider } from '@react-oauth/google';
  import { BrowserRouter as Router } from 'react-router-dom';
  import theme from './theme';
  import AppRoutes from './AppRoutes'; // Your routing component

  function App() {
    return (
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <AppRoutes />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    );
  }

  export default App;
  ```

- **Using the useAuth hook in components**: Import and use the `useAuth` hook to access authentication state and functions in any component within the provider.

  ```jsx
  // Example in a component
  import { useAuth } from '../contexts/AuthContext';

  function MyComponent() {
    const { user, isAuthenticated, loading, error, login, logOut, refresh } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (isAuthenticated) {
      return (
        <div>
          <h1>Welcome, {user?.email}!</h1>
          <p>Your role: {user?.role}</p>
          <button onClick={logOut}>Logout</button>
        </div>
      );
    }
    
    return <div>Please log in</div>;
  }
  ```

- **AuthContext API**: The AuthContext provides the following values:
  - `user`: Current user object with id, email, role, etc.
  - `loading`: Boolean indicating if authentication state is being loaded
  - `error`: Error message if authentication failed
  - `login(token)`: Function to log in with a JWT token
  - `logOut()`: Function to log out and clear auth state
  - `refresh()`: Function to manually refresh the token
  - `isAuthenticated`: Boolean indicating if user is authenticated
  - `hasRole(roles)`: Function to check if user has specific role(s)
  - `isAuthorized(roles)`: Function to check if user is authorized for specific roles

- **Login and logout functions**: The `login` function accepts a JWT token, decodes it using `jwt-decode` to extract user info, and stores it in both localStorage and sessionStorage for security. The `logOut` function clears all tokens and sensitive data from storage and redirects to the login page.

- **Persistence**: On app load, the context checks storage for a valid JWT and restores the authentication state automatically.

- **Token refresh**: Automatic token refresh is implemented by monitoring expiration and refreshing tokens proactively before they expire. This is handled through axios interceptors and periodic checks.

### How to implement ProtectedRoute for protecting components

The `ProtectedRoute` component safeguards routes by checking authentication and roles. It integrates seamlessly with React Router and provides a user-friendly experience with loading states and error handling.

- **Props**:
  - `children`: The components to protect (e.g., `<Dashboard />`).
  - `requiredRoles` (optional): Restricts access to specific roles. Can be a string or array of strings.
  - `requireAllRoles` (optional): When true, user must have ALL specified roles (default: false).

- **Integration in App.jsx routes**: Use it as a wrapper around protected routes in your router setup.

  ```jsx
  // src/App.jsx
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { ProtectedRoute } from './components/ProtectedRoute';
  import LoginPage from './pages/LoginPage';
  import DashboardGuru from './pages/DashboardGuru';
  import PortalOrtu from './pages/PortalOrtu';
  import AdminDashboard from './pages/AdminDashboard';

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal/parent" element={
            <ProtectedRoute requiredRoles="parent">
              <PortalOrtu />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/guru" element={
            <ProtectedRoute requiredRoles="guru">
              <DashboardGuru />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/restricted" element={
            <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles={true}>
              <RestrictedPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    );
  }
  ```

- **Auth checks and role authorization**: Internally, it uses `useAuth` to verify `isAuthenticated`. If not authenticated, it redirects to `/login`. For roles, it compares `user.role` from the decoded JWT against `requiredRoles`.

- **Loading and error handling**: Displays a loading spinner while checking auth state. On authorization failure, it shows an error message with details about required roles.

- **Multiple role support**: You can specify multiple roles where the user needs to have at least one of them, or require all specified roles using the `requireAllRoles` prop.

### Best practices for handling JWT tokens in the frontend

The implementation follows security best practices for JWT token handling:

- **Secure storage**: Tokens are stored in both localStorage and sessionStorage for persistence and additional security. sessionStorage is preferred when available as it's cleared when the tab is closed.

- **Validation and expiration**: Tokens are validated on load/refresh using `jwt-decode`. Expiration is checked with a 5-minute buffer to handle network delays. Tokens expiring within 15 minutes are automatically refreshed.

- **Automatic refresh**: Token refresh is implemented with proactive checks (15-minute buffer before expiration) and axios interceptors that refresh tokens before making API requests.

- **Cleanup on logout**: Secure cleanup removes tokens from all storage locations and clears other sensitive data.

- **Production considerations**: The implementation is designed for HTTPS only. Tokens have a 24-hour lifetime with proactive refresh. Audit for token leakage in logs or URLs.

- **Token structure handling**: The system handles different JWT token structures, accommodating both backend formats and frontend expectations.

### Example usage of authentication components with code snippets

- **LoginPage integration**: The `LoginPage` uses `useAuth().login` to authenticate with a token.

  ```jsx
  // src/pages/LoginPage.jsx (simplified example)
  import { useAuth } from '../contexts/AuthContext';
  import { useNavigate } from 'react-router-dom';
  import api from '../utils/api';

  export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await api.post('/login', { email, password });
        if (response.data.token) {
          const result = await login(response.data.token);
          if (result.success) {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return (
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    );
  }
  ```

- **Protected route wrapping**: See the App.jsx example above. Unauthenticated users are redirected to `/login`.

- **Role-based access**: Use `requiredRoles` prop for role-based access control.

  ```jsx
  // In App.jsx - Single role
  <Route
    path="/parent-dashboard"
    element={
      <ProtectedRoute requiredRoles="parent">
        <ParentDashboard />
      </ProtectedRoute>
    }
  />

  // In App.jsx - Multiple roles (user needs at least one)
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute requiredRoles={['guru', 'admin']}>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  // In App.jsx - Multiple roles (user needs all)
  <Route
    path="/admin/settings"
    element={
      <ProtectedRoute requiredRoles={['admin', 'superuser']} requireAllRoles={true}>
        <Settings />
      </ProtectedRoute>
    }
  />
  ```

- **Simple logout button**: Place in a navbar or profile component.

  ```jsx
  // Example logout button
  import { useAuth } from '../contexts/AuthContext';

  function LogoutButton() {
    const { logOut } = useAuth();

    return <button onClick={logOut}>Logout</button>;
  }
  ```

- **Role checking in components**: Use `hasRole` or `isAuthorized` for conditional rendering based on user roles.

  ```jsx
  // Example component with role-based features
  import { useAuth } from '../contexts/AuthContext';

  function Dashboard() {
    const { user, hasRole, isAuthorized } = useAuth();

    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}!</p>
        
        {hasRole('admin') && (
          <div>
            <h2>Admin Panel</h2>
            <button>Manage Users</button>
          </div>
        )}
        
        {isAuthorized(['guru', 'admin']) && (
          <div>
            <h2>Teacher/Admin Features</h2>
            <button>Manage Classes</button>
          </div>
        )}
      </div>
    );
  }
  ```

These features ensure secure, user-friendly authentication. For backend integration details, refer to the backend README and the detailed documentation in `src/contexts/README.md`.
