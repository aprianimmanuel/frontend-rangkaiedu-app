import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { http } from 'msw';
import { setupServer } from 'msw/node';

import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { api } from '../utils/api';

jest.mock('../utils/api', () => {
  const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(() => 1), // Return interceptor ID
        eject: jest.fn()
      },
      response: {
        use: jest.fn(() => 2), // Return interceptor ID
        eject: jest.fn()
      },
    },
  };
  return {
    __esModule: true,
    default: mockAxios,
    api: mockAxios,
  };
});

// Mock jwt-decode for token handling
const mockJwtDecode = jest.fn();
jest.mock('jwt-decode', () => {
  return jest.fn();
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'token') return 'mock-token';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// MSW server setup
const server = setupServer(
  http.post('http://localhost:8080/api/auth/verify-role', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  http.post('http://localhost:8080/api/auth/whatsapp-otp/send', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  http.post('http://localhost:8080/api/auth/whatsapp-otp/verify', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-jwt-token' }));
  }),
  http.post('http://localhost:8080/api/auth/google', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-google-token' }));
  }),
  http.get('http://localhost:8080/api/protected', (req, res, ctx) => {
    return res(ctx.json({ data: 'Protected data' }));
  }),
  http.post('http://localhost:8080/api/auth/refresh', (req, res, ctx) => {
    return res(ctx.status(401));
  })
);

jest.mock('../components/MockGoogleLogin', () => ({
  default: ({ onSuccess, onError }) => (
    <button
      data-testid="mock-google-login-button"
      onClick={() => onSuccess({ credential: 'mock-google-token' })}
      aria-label="Mock Google Login for testing"
    >
      Mock Google Login
    </button>
  )
}));

// Test child for protected route
const ProtectedContent = () => <div data-testid="protected-content">Protected Page</div>;

// Theme
const theme = createTheme();

// Wrapper
const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

// Enhanced wrapper that sets up localStorage for auth state
const renderWithProvidersAndAuth = (ui, { route = '/', token = null } = {}) => {
  // Setup localStorage with token if provided
  if (token) {
    window.localStorage.setItem('token', token);
  }
  
  const result = render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
  
  // Clean up localStorage after test
  if (token) {
    window.localStorage.removeItem('token');
  }
  
  return result;
};

// Error boundary for testing
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if the error is related to useAuth and provide a more helpful message
      if (this.state.error?.message?.includes('useAuth')) {
        return (
          <div data-testid="error-boundary">
            <h2>Test Error Boundary</h2>
            <p>Error: useAuth is not defined - AuthContext not properly provided</p>
          </div>
        );
      }
      return (
        <div data-testid="error-boundary">
          <h2>Test Error Boundary</h2>
          <p>Error: {this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
};

// Enhanced render function with error boundary
const renderWithProvidersAndErrorBoundary = (ui, { route = '/' } = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <ErrorBoundary>
          <AuthProvider>
            {ui}
          </AuthProvider>
        </ErrorBoundary>
      </MemoryRouter>
    </ThemeProvider>
  );
};

// Helper function to wait for async operations
const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 100));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth Integration Flow', () => {
  it('unauthenticated user sees login page and can select role', async () => {
    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    );

    // Wait for the page to load and check for welcome text
    await waitFor(() => {
      expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Select parent role
    const parentCard = screen.getByText('Parent').closest('button');
    expect(parentCard).toBeInTheDocument();
    await userEvent.click(parentCard);

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login as parent/i })).toBeInTheDocument();
    }, { timeout: 10000 });
    
    // Wait for the phone number input to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('completes WhatsApp login flow and redirects to protected route', async () => {
    server.use(
      http.post('http://localhost:8080/api/auth/whatsapp-otp/send', (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      }),
      http.post('http://localhost:8080/api/auth/whatsapp-otp/verify', (req, res, ctx) => {
        return res(ctx.json({ token: 'mock-jwt-token' }));
      })
    );

    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/portal/parent" element={
          <ProtectedRoute requiredRole="ortu">
            <ProtectedContent />
          </ProtectedRoute>
        } />
      </Routes>,
      { route: '/' }
    );

    // Wait for page to load and find Parent role
    await waitFor(() => {
      expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Select role
    const parentCard = screen.getByText('Parent').closest('button');
    expect(parentCard).toBeInTheDocument();
    await userEvent.click(parentCard);

    // Wait for phone number input to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Enter phone
    const phoneInput = screen.getByLabelText('Phone Number');
    await userEvent.type(phoneInput, '+6281234567890');

    // Send OTP
    const sendButton = screen.getByText('Send OTP via WhatsApp');
    await userEvent.click(sendButton);

    // Wait for OTP to be sent
    await waitFor(() => {
      expect(screen.getByText('OTP sent successfully. Please check your WhatsApp.')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Should redirect to protected route
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('completes Google login and accesses protected route with correct role', async () => {
    server.use(
      http.post('http://localhost:8080/api/auth/verify-role', (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      }),
      http.post('http://localhost:8080/api/auth/google', (req, res, ctx) => {
        return res(ctx.json({ token: 'mock-google-token' }));
      })
    );

    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedContent />
          </ProtectedRoute>
        } />
      </Routes>,
      { route: '/' }
    );

    // Wait for page to load and find School Admin role
    await waitFor(() => {
      expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Select admin role
    const adminCard = screen.getByText('School Admin').closest('button');
    expect(adminCard).toBeInTheDocument();
    await userEvent.click(adminCard);

    // Wait for login form to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login as school admin/i })).toBeInTheDocument();
    }, { timeout: 10000 });

    // Switch to social tab
    const socialTab = screen.getByText('Social');
    await userEvent.click(socialTab);

    // Use Google login
    const googleButton = screen.getByTestId('mock-google-login-button');
    await userEvent.click(googleButton);

    // Wait for protected content to appear
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('handles unauthorized access to protected route', async () => {
    // Mock authenticated as 'guru' but try to access 'admin' route
    window.localStorage.setItem('token', 'mock-token-guru');
    
    // Mock jwt-decode to return a user with 'guru' role
    const mockJwtDecode = require('jwt-decode');
    mockJwtDecode.mockImplementation(() => ({ id: '1', role: 'guru', exp: Math.floor(Date.now() / 1000) + 3600 }));

    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedContent />
          </ProtectedRoute>
        } />
      </Routes>,
      { route: '/admin' }
    );

    // Should show unauthorized alert
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    }, { timeout: 15000 });
  }, 15000);

  it('logs out and redirects to login', async () => {
    // Start authenticated
    window.localStorage.setItem('token', 'mock-token');
    
    // Mock jwt-decode to return a valid user
    const mockJwtDecode = require('jwt-decode');
    mockJwtDecode.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));

    // Create a test component that uses the auth context
    const TestLogoutComponent = () => {
      const { logOut } = require('../contexts/AuthContext').useAuth();
      
      return (
        <div>
          <button data-testid="logout-btn" onClick={logOut}>Logout</button>
          <ProtectedContent />
        </div>
      );
    };

    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <TestLogoutComponent />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>,
      { route: '/dashboard' }
    );

    // Wait for protected content to appear
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Click logout
    const logoutBtn = screen.getByTestId('logout-btn');
    expect(logoutBtn).toBeInTheDocument();
    await userEvent.click(logoutBtn);

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    }, { timeout: 15000 });
  }, 20000);

  it('handles 401 error by logging out and redirecting to login', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });
    
    // Mock jwt-decode to return a valid user
    const mockJwtDecode = require('jwt-decode');
    mockJwtDecode.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));

    renderWithProvidersAndErrorBoundary(
      <Routes>
        <Route path="/protected" element={
          <ProtectedRoute>
            <div>
              <button data-testid="api-call-btn" onClick={async () => {
                try {
                  await api.get('/protected');
                } catch(e) {
                  console.log('API error', e);
                }
              }}>Call API</button>
              <ProtectedContent />
            </div>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>,
      { route: '/protected' }
    );

    // Wait for protected content to appear
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Trigger API call
    const apiBtn = screen.getByTestId('api-call-btn');
    expect(apiBtn).toBeInTheDocument();
    await userEvent.click(apiBtn);

    // After 401, should redirect to login
    await waitFor(() => {
      expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    }, { timeout: 15000 });
  }, 20000);
});