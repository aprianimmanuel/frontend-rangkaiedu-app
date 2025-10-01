import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth from AuthContext
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

// Mock Navigate component to prevent infinite loops in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to, state, replace }) => (
    <div data-testid="navigate-mock" data-to={to} data-state={JSON.stringify(state)} data-replace={replace}>
      Navigate to {to}
    </div>
  ),
  useLocation: () => ({
    pathname: '/protected',
    search: '',
    hash: '',
    state: null,
  }),
}));

const mockUseAuth = require('../contexts/AuthContext').useAuth;

// Test child component
const TestChild = () => <div data-testid="child-content">Protected Content</div>;

// Wrapper for rendering
const renderProtectedRoute = (authState, requiredRoles = null, initialEntries = ['/protected'], requireAllRoles = false) => {
  mockUseAuth.mockReturnValue(authState);
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProtectedRoute requiredRoles={requiredRoles} requireAllRoles={requireAllRoles}>
        <TestChild />
      </ProtectedRoute>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when loading is true', () => {
    renderProtectedRoute({ loading: true, isAuthenticated: false });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderProtectedRoute({ loading: false, isAuthenticated: false });

    expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
    expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/login');
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows unauthorized alert when required role does not match', () => {
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: jest.fn(() => false), user: { role: 'student' } },
      'admin'
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You do not have the required permissions to access this page.')).toBeInTheDocument();
    expect(screen.getByText('Required role: admin')).toBeInTheDocument();
    expect(screen.getByText('Your current role: student')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('renders children when authenticated and authorized (no required role)', () => {
    renderProtectedRoute({ loading: false, isAuthenticated: true });

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('renders children when authenticated and has required role', () => {
    const mockHasRole = jest.fn(() => true);
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: mockHasRole, user: { role: 'admin' } },
      'admin'
    );

    expect(mockHasRole).toHaveBeenCalledWith('admin');
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('handles multiple required roles (array) - any role match', () => {
    const mockHasRole = jest.fn((role) => role === 'guru'); // Only has 'guru' role
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: mockHasRole, user: { role: 'guru' } },
      ['admin', 'guru']
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('handles multiple required roles (array) - no role match', () => {
    const mockHasRole = jest.fn(() => false);
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: mockHasRole, user: { role: 'student' } },
      ['admin', 'guru']
    );

    expect(screen.getByText('Required roles: admin, guru')).toBeInTheDocument();
    expect(screen.getByText('Your current role: student')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('shows accessible error message with proper ARIA attributes', () => {
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: jest.fn(() => false), user: { role: 'student' } },
      'admin'
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeVisible();
  });

  it('handles requireAllRoles parameter correctly', () => {
    const mockHasRole = jest.fn((role) => role === 'admin'); // Only has 'admin' role
    renderProtectedRoute(
      { loading: false, isAuthenticated: true, hasRole: mockHasRole, user: { role: 'admin' } },
      ['admin', 'superuser'],
      ['/protected'],
      true // requireAllRoles
    );

    // Should show unauthorized alert since user doesn't have both roles
    expect(screen.getByText('Required roles: admin, superuser')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });
});