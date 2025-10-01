import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import * as authUtils from '../utils/auth';
import * as apiUtils from '../utils/api';

// Mock modules
jest.mock('../utils/auth');
jest.mock('../utils/api');
jest.mock('jwt-decode', () => jest.fn());

// Setup proper logout mocking
authUtils.logout.mockImplementation(() => {
  // Clear any stored tokens
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
});

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

// Mock window.location.replace for testing redirect
const mockLocationReplace = jest.fn();
delete window.location;
window.location = { replace: mockLocationReplace };

// Mock jwt-decode
const mockJwtDecode = require('jwt-decode');
mockJwtDecode.mockImplementation((token) => {
  // Handle both possible token structures
  if (typeof token === 'object' && token.user) {
    return token;
  }
  // Handle string tokens
  if (typeof token === 'string') {
    return { user: { id: '1', role: 'admin' }, exp: Math.floor(Date.now() / 1000) + 3600 };
  }
  return { user: { id: '1', role: 'admin' }, exp: Math.floor(Date.now() / 1000) + 3600 };
});

// Test component to use the context
const TestComponent = ({ onAuthChange }) => {
  const { user, loading, error, login, logOut, refresh, isAuthenticated, hasRole, isAuthorized } = useAuth();
  React.useEffect(() => {
    onAuthChange({ user, loading, error, isAuthenticated });
  }, [user, loading, error, isAuthenticated]);
  return (
    <div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <button onClick={() => login('login-token')}>Login</button>
      <button onClick={logOut}>Logout</button>
      <button onClick={refresh}>Refresh</button>
      <button onClick={async () => { try { await apiUtils.default.get('/protected'); } catch(e) { console.log('API error', e); } }}>Test API</button>
      <div data-testid="hasRole">{String(hasRole('admin'))}</div>
      <div data-testid="isAuthorized">{String(isAuthorized(['admin']))}</div>
    </div>
  );
};

const renderWithAuthProvider = (component, initialState = {}) => {
  mockLocalStorage.getItem.mockImplementation((key) => {
    if (key === 'token') {
      return initialState.token || null;
    }
    return null;
  });
  mockSessionStorage.getItem.mockImplementation((key) => {
    if (key === 'token') {
      return initialState.token || null;
    }
    return null;
  });
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockSessionStorage.getItem.mockReturnValue(null);
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.removeItem.mockClear();
    apiUtils.default.interceptors.request.use.mockClear();
    apiUtils.default.interceptors.response.use.mockClear();
    mockLocationReplace.mockClear();
  });

  it('initializes without token, sets user to null and loading to false', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />);

    await waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledWith({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  it('initializes with valid token, decodes user and sets state', async () => {
    const mockToken = 'valid-token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });

    // Wait for all state updates to complete
    await waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledWith({
        user: { id: '1', role: 'admin', exp: expect.any(Number) },
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    }, { timeout: 2000 });
    
    // Also check that decodeToken was called
    expect(authUtils.decodeToken).toHaveBeenCalledWith(mockToken);
  });

  it('initializes with expired token, attempts refresh and logs out if fails', async () => {
    const mockToken = 'expired-token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) - 1000 }));
    authUtils.isTokenExpired.mockReturnValue(true);
    authUtils.refreshToken.mockRejectedValue(new Error('Refresh failed'));
    authUtils.setToken.mockClear();
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });

    // Wait for all state updates to complete
    await waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledWith({
        user: null,
        loading: false,
        error: expect.any(String),
        isAuthenticated: false,
      });
    }, { timeout: 2000 });
    
    expect(authUtils.logout).toHaveBeenCalled();
  });

  it('login sets user, token in storage, clears error', async () => {
    const mockToken = 'login-token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '2', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.setToken.mockClear();

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />);

    await userEvent.click(screen.getByText('Login'));

    // Wait for all state updates to complete
    await waitFor(() => {
      expect(authUtils.setToken).toHaveBeenCalledWith(mockToken);
      expect(onAuthChange).toHaveBeenCalledWith({
        user: { id: '2', role: 'user', exp: expect.any(Number) },
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    }, { timeout: 2000 });
  });

  it('login fails with invalid token, sets error', async () => {
    authUtils.decodeToken.mockImplementation((token) => {
      if (token === 'login-token') {
        return null; // Invalid token
      }
      return { id: '2', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 };
    });
    authUtils.getToken.mockReturnValue(null);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />);

    await userEvent.click(screen.getByText('Login'));

    // Wait for all state updates to complete
    await waitFor(() => {
      expect(onAuthChange).toHaveBeenLastCalledWith({
        user: null,
        loading: false,
        error: 'Login failed: Invalid token',
        isAuthenticated: false,
      });
    }, { timeout: 2000 });
    
    expect(authUtils.setToken).not.toHaveBeenCalled();
  });

  it('logout clears user, error, calls logout util', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });

    // Wait for initial auth state
    await waitFor(() => expect(onAuthChange).toHaveBeenCalledWith(expect.objectContaining({
      isAuthenticated: true,
      user: { id: '1', role: 'admin', exp: expect.any(Number) }
    })), { timeout: 2000 });

    await userEvent.click(screen.getByText('Logout'));

    // Wait for logout state updates
    await waitFor(() => {
      expect(authUtils.logout).toHaveBeenCalled();
      expect(onAuthChange).toHaveBeenCalledWith({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }, { timeout: 2000 });
  });

  it('refresh succeeds, updates token and user', async () => {
    const oldToken = 'old-token';
    const newToken = 'new-token';
    authUtils.decodeToken
      .mockImplementationOnce(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }))
      .mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 7200 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.refreshToken.mockResolvedValue(newToken);
    authUtils.getToken.mockReturnValue(oldToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: oldToken });

    // Wait for initial auth state
    await waitFor(() => expect(onAuthChange).toHaveBeenCalledWith(expect.objectContaining({
      isAuthenticated: true,
      user: { id: '1', role: 'admin', exp: expect.any(Number) }
    })), { timeout: 2000 });

    await userEvent.click(screen.getByText('Refresh'));

    // Wait for refresh state updates
    await waitFor(() => {
      expect(authUtils.refreshToken).toHaveBeenCalled();
      expect(authUtils.setToken).toHaveBeenCalledWith(newToken);
      expect(onAuthChange).toHaveBeenCalledWith(expect.objectContaining({ isAuthenticated: true }));
    }, { timeout: 2000 });
  });

  it('refresh fails, logs out and sets error', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.refreshToken.mockRejectedValue(new Error('Refresh failed'));
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });

    // Wait for initial auth state
    await waitFor(() => expect(onAuthChange).toHaveBeenCalledWith(expect.objectContaining({
      isAuthenticated: true,
      user: { id: '1', role: 'admin', exp: expect.any(Number) }
    })), { timeout: 2000 });

    await userEvent.click(screen.getByText('Refresh'));

    // Wait for refresh failure state updates
    await waitFor(() => {
      expect(onAuthChange).toHaveBeenLastCalledWith({
        user: null,
        loading: false,
        error: 'Token refresh failed: Refresh failed',
        isAuthenticated: false,
      });
    }, { timeout: 2000 });

    expect(authUtils.refreshToken).toHaveBeenCalled();
    expect(authUtils.logout).toHaveBeenCalled();
  });

  it('hasRole returns true for matching role', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    renderWithAuthProvider(<TestComponent onAuthChange={() => {}} />, { token: mockToken });

    // Wait for auth state to be set
    const hasRoleElement = await screen.findByTestId('hasRole');
    expect(hasRoleElement.textContent).toBe('true');
  });

  it('hasRole returns false for non-matching role', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    renderWithAuthProvider(<TestComponent onAuthChange={() => {}} />, { token: mockToken });

    const hasRoleElement = await screen.findByTestId('hasRole');
    expect(hasRoleElement.textContent).toBe('false');
  });

  it('isAuthorized returns true if authenticated and has required role', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    renderWithAuthProvider(<TestComponent onAuthChange={() => {}} />, { token: mockToken });

    // Wait for auth state to be set
    const isAuthorizedElement = await screen.findByTestId('isAuthorized');
    expect(isAuthorizedElement.textContent).toBe('true');
  });

  it('isAuthorized returns false if not authenticated', async () => {
    authUtils.getToken.mockReturnValue(null);

    renderWithAuthProvider(<TestComponent onAuthChange={() => {}} />);

    const isAuthorizedElement = await screen.findByTestId('isAuthorized');
    expect(isAuthorizedElement.textContent).toBe('false');
  });

  it('throws error if useAuth used outside provider', () => {
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');
  });

  it('sets up axios request interceptor with token', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    renderWithAuthProvider(<div>Test</div>, { token: mockToken });

    await waitFor(() => {
      expect(apiUtils.default.interceptors.request.use).toHaveBeenCalled();
    });
  });

  it('handles 401 response by logging out and redirecting', async () => {
    const mockToken = 'token';
    authUtils.decodeToken.mockImplementation(() => ({ id: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }));
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.getToken.mockReturnValue(mockToken);

    const onAuthChange = jest.fn();
    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />, { token: mockToken });

    // Wait for initial authenticated state
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      expect(onAuthChange).toHaveBeenCalledWith(expect.objectContaining({
        user: { id: '1', role: 'admin', exp: expect.any(Number) },
        isAuthenticated: true,
        loading: false,
        error: null,
      }));
    });

    // Wait for interceptors to be set up
    await waitFor(() => {
      expect(apiUtils.default.interceptors.response.use).toHaveBeenCalled();
    });

    // Capture the response error handler registered in the AuthProvider useEffect
    const [[, responseErrorHandler]] = apiUtils.default.interceptors.response.use.mock.calls;

    // Mock the API to reject with 401, but simulate running through the response error interceptor
    const error = { response: { status: 401 } };

    // Invoke the captured response error handler in an act block
    await act(async () => {
      try {
        await responseErrorHandler(error);
      } catch (e) {
        // Expected: the handler rejects the promise after handling logout
      }
    });

    // Verify state changes after 401 handling
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('error').textContent).toBe('');
      expect(authUtils.logout).toHaveBeenCalled();
      expect(onAuthChange).toHaveBeenCalledWith({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocationReplace).toHaveBeenCalledWith('/login');
    }, { timeout: 2000 });
  });
});
