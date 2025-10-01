import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Mock modules
jest.mock('../utils/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  }
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

const mockApi = api;
const mockUseNavigate = useNavigate;
const mockNavigate = jest.fn();
const mockUseAuth = require('../contexts/AuthContext').useAuth;

// Mock theme
const theme = createTheme();

// Wrapper for rendering with providers
const renderLoginPage = (initialAuthState = { isAuthenticated: false, user: null, login: jest.fn() }, navigateFn = mockNavigate) => {
  mockUseAuth.mockReturnValue(initialAuthState);
  mockUseNavigate.mockReturnValue(navigateFn);
  mockApi.post.mockResolvedValue({ data: { success: true } });

  // Set language to English for tests
  localStorage.setItem('language', 'en');

  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.post.mockResolvedValue({ data: { success: true } });
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      user: null,
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  it('renders role selection cards correctly', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome to Rangkaiedu')).toBeInTheDocument();
    expect(screen.getByText('Choose your role to get started')).toBeInTheDocument();

    // Role cards
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText("View your child's grades and progress in real-time.")).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('School Admin')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();

    // Icons (assuming they render)
    expect(screen.getAllByRole('button')).toHaveLength(4); // Role cards
  });

  it('switches language between EN and ID', () => {
    renderLoginPage();

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();

    fireEvent.click(switchElement);

    // Texts should change to ID
    expect(screen.getByText('Selamat Datang di Rangkaiedu')).toBeInTheDocument();
    expect(screen.getByText('Pilih peran Anda untuk memulai')).toBeInTheDocument();
    expect(screen.getByText('Orang Tua / Wali')).toBeInTheDocument();
  });

  it('shows loading state during role verification', async () => {
    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    // Wait a bit for the loading state to appear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-role', expect.any(Object));
    }, { timeout: 5000 });
  }, 10000);

  it('handles role verification success and shows login form', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-role', expect.any(Object));
    });

    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('handles role verification failure and shows error snackbar', async () => {
    mockApi.post.mockRejectedValueOnce({ response: { data: { message: 'Verification failed' } } });

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Role verification failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('validates phone number input', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    renderLoginPage();

    // First select a role to show form
    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    const whatsappTab = screen.getByText('WhatsApp');
    await userEvent.click(whatsappTab);

    const phoneInput = screen.getByLabelText('Phone Number');
    await userEvent.type(phoneInput, 'invalid');

    expect(phoneInput).toHaveAttribute('aria-invalid', 'true');
    await waitFor(() => {
      expect(screen.getByText('Enter valid Indonesian number (e.g., +6281234567890)')).toBeInTheDocument();
    }, { timeout: 5000 });

    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '+6281234567890');
    expect(phoneInput).not.toHaveAttribute('aria-invalid');
  }, 10000);

  it('disables send OTP button for invalid phone', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    });

    const whatsappTab = screen.getByText('WhatsApp');
    fireEvent.click(whatsappTab);

    const sendButton = screen.getByText('Send OTP via WhatsApp');
    expect(sendButton).toBeDisabled();

    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '+6281234567890' } });

    expect(sendButton).not.toBeDisabled();
  });

  it('sends WhatsApp OTP on valid submission', async () => {
    const mockLogin = jest.fn();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
    });

    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // verify-role
    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // OTP send

    renderLoginPage({ login: mockLogin });

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    const whatsappTab = screen.getByText('WhatsApp');
    fireEvent.click(whatsappTab);

    await waitFor(() => {
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '+6281234567890' } });

    const sendButton = screen.getByText('Send OTP via WhatsApp');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/whatsapp-otp/send', {
        phone: '+6281234567890',
        role: 'ortu',
      });
    });
  });

  it('handles WhatsApp OTP send error', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // verify-role
    mockApi.post.mockRejectedValueOnce({ response: { data: { message: 'Send failed' } } }); // OTP send

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    const whatsappTab = screen.getByText('WhatsApp');
    fireEvent.click(whatsappTab);

    await waitFor(() => {
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '+6281234567890' } });

    const sendButton = screen.getByText('Send OTP via WhatsApp');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to send OTP')).toBeInTheDocument();
    });
  });

  it('handles Google login success', async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();
    mockUseAuth.mockReturnValue({ login: mockLogin, isAuthenticated: false, user: null });
    mockUseNavigate.mockReturnValue(mockNavigate);

    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // verify-role
    mockApi.post.mockResolvedValueOnce({ // google login
      data: {
        token: 'mock-google-token',
        user: { role: 'ortu' }
      }
    });

    renderLoginPage({ login: mockLogin });

    // First select a role
    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Switch to social tab
    const socialTab = screen.getByText('Social');
    await userEvent.click(socialTab);

    // Click Google login button
    const googleButton = screen.getByText('Mock Google Login');
    await act(async () => {
      await userEvent.click(googleButton);
    });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/google', expect.any(Object));
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('mock-google-token');
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/portal/parent');
    }, { timeout: 5000 });
  }, 10000);

  it('handles Google login error', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // verify-role
    mockApi.post.mockRejectedValueOnce({ response: { data: { message: 'Google failed' } } }); // google

    renderLoginPage();

    // First select a role
    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Switch to social tab
    const socialTab = screen.getByText('Social');
    fireEvent.click(socialTab);

    // Click Google login button
    const googleButton = screen.getByText('Mock Google Login');
    await act(async () => {
      fireEvent.click(googleButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Google login failed')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles Facebook login success', async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();
    mockUseAuth.mockReturnValue({ login: mockLogin, isAuthenticated: false, user: null });
    mockUseNavigate.mockReturnValue(mockNavigate);

    renderLoginPage({ login: mockLogin });

    // First select a role
    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Switch to social tab
    const socialTab = screen.getByText('Social');
    fireEvent.click(socialTab);

    // Click Facebook login button
    const facebookButton = screen.getByText('Mock Facebook Login');
    await act(async () => {
      fireEvent.click(facebookButton);
    });

    // For Facebook, we're mocking the success directly in the component
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('redirects authenticated user to role-specific route', async () => {
    const mockNavigate = jest.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: true,
      user: { role: 'guru' },
    });

    await act(async () => {
      renderLoginPage({ isAuthenticated: true, user: { role: 'guru' } });
    });

    // Wait for navigation to happen
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/guru');
    }, { timeout: 10000 });
  }, 15000);

  it('supports keyboard navigation for accessibility', async () => {
    renderLoginPage();

    const roleCards = screen.getAllByRole('button');
    expect(roleCards).toHaveLength(4);

    // Simulate tab and focus on first card
    await act(async () => {
      roleCards[0].focus();
      fireEvent.keyDown(roleCards[0], { key: 'Tab', code: 'Tab' });
    });
    // Note: In JSDOM, focus simulation is limited; verify tabindex instead
    expect(roleCards[0]).toHaveAttribute('tabindex', '0');

    // Enter to select
    await act(async () => {
      fireEvent.keyDown(roleCards[0], { key: 'Enter', code: 'Enter' });
    });
    // Would trigger click
  });

  it('displays error snackbar and allows dismissal', async () => {
    renderLoginPage();

    // Trigger an error (e.g., role verification fail)
    mockApi.post.mockRejectedValueOnce(new Error('Test error'));

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      fireEvent.click(parentCard);
    });

    await waitFor(() => {
      const snackbar = screen.getByRole('alert');
      expect(snackbar).toBeInTheDocument();
      expect(snackbar).toHaveTextContent('Role verification failed. Please try again.');
    });

    // Close snackbar
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('handles loading state during login processes', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Switch to WhatsApp tab
    const whatsappTab = screen.getByText('WhatsApp');
    await userEvent.click(whatsappTab);

    // Test WhatsApp loading state
    const phoneInput = screen.getByLabelText('Phone Number');
    await userEvent.type(phoneInput, '+6281234567890');

    const sendButton = screen.getByText('Send OTP via WhatsApp');
    await act(async () => {
      await userEvent.click(sendButton);
    });

    // Wait a bit for the loading state to appear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('handles email login form validation', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    renderLoginPage();

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-role', expect.any(Object));
    }, { timeout: 5000 });

    // Test email validation
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    // Try to submit empty form
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Test invalid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'password123');
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Test short password
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, '123');
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('handles successful email login', async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();
    mockUseAuth.mockReturnValue({ login: mockLogin, isAuthenticated: false, user: null });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockApi.post.mockResolvedValueOnce({ data: { success: true } }); // verify-role
    mockApi.post.mockResolvedValueOnce({ // login
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com', role: 'ortu' }
      }
    });

    renderLoginPage({ login: mockLogin });

    const parentCard = screen.getByText('Parent').closest('button');
    await act(async () => {
      await userEvent.click(parentCard);
    });

    // Wait for the login form to appear
    await waitFor(() => {
      expect(screen.getByText('Login as Parent')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-role', expect.any(Object));
    }, { timeout: 5000 });

    // Fill in form (default tab is email)
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    const loginButton = screen.getByText('Login');
    await act(async () => {
      await userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockLogin).toHaveBeenCalledWith('mock-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/portal/parent');
    }, { timeout: 5000 });
  }, 10000);
});