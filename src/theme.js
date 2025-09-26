// Import necessary modules from MUI
import { createTheme } from '@mui/material/styles';

// To load Google Fonts (Nunito Sans and Poppins), add this link to public/index.html in the <head> section:
// <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@700&display=swap" rel="stylesheet">
// Alternatively, add @import to src/index.css:
// @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@700&display=swap');
// The theme below references these font families; ensure they are loaded for proper rendering.

/**
 * Custom theme for Rangkai Edu application
 * @type {import('@mui/material/styles').Theme}
 */
const theme = createTheme({
  // Color Palette
  palette: {
    primary: {
      main: '#2A4D8E', // Biru Kepercayaan
      light: '#5577B8',
      dark: '#1D3563',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F7941D', // Oranye Koneksi
      light: '#F9AE4D',
      dark: '#AC6715',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50', // Hijau Kejelasan
      light: '#7BC47F',
      dark: '#357A38',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#f44336',
      light: '#f6685e',
      dark: '#aa2e25',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2196f3',
      light: '#4dabf5',
      dark: '#1976d2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },

  // Typography System - Enhanced with responsive scale, custom variants, accessibility considerations
  // Uses rem units for scalability, line heights >=1.5 for body text readability,
  // Poppins (700) for headings, Nunito Sans (400/600) for body/subtitles.
  // Responsive font sizes via breakpoints (xs/mobile smaller, md+ larger).
  typography: {
    fontFamily: "'Nunito Sans', sans-serif", // Default body font

    // Custom variant: Large display for hero sections or banners
    display1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '2.25rem', md: '3.5rem', lg: '4rem' },
      lineHeight: 1.2,
      letterSpacing: { xs: '-0.01em', md: '-0.025em' },
    },

    // Headings: Poppins bold, responsive sizing for better mobile experience
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '1.875rem', md: '2.5rem' },
      lineHeight: 1.2,
      letterSpacing: { xs: '-0.01em', md: '-0.02em' },
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '1.5rem', md: '2rem', lg: '2.25rem' },
      lineHeight: 1.25,
      letterSpacing: { xs: '-0.01em', md: '-0.015em' },
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '1.375rem', md: '1.75rem' },
      lineHeight: 1.3,
      letterSpacing: { xs: '-0.005em', md: '-0.01em' },
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '1.25rem', md: '1.5rem' },
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: { xs: '1.125rem', md: '1.25rem' },
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.45,
    },

    // Body text: Nunito Sans regular, enhanced line height for accessibility
    body1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6, // Increased from 1.5 for better readability
      letterSpacing: '0.009em',
    },
    body2: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5, // Ensures >=1.5 for accessibility
      letterSpacing: '0.007em',
    },

    // Subtitles: Semi-bold for emphasis
    subtitle1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: { xs: '0.875rem', md: '1rem' },
      lineHeight: 1.6,
    },
    subtitle2: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },

    // Custom variant: Prominent body text for leads/intros
    lead: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: { xs: '1rem', md: '1.125rem' },
      lineHeight: 1.6,
      letterSpacing: '0.009em',
    },

    // Smaller text variants
    caption: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4, // Slightly increased for legibility
      letterSpacing: '0.033em',
    },
    overline: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },

    // Button text: No transform, semi-bold
    button: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.028em',
    },
  },

  // Component Customization
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2A4D8E',
            },
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 16,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'primary',
        elevation: 0,
      },
      styleOverrides: {
        root: {
          height: 64,
        },
      },
    },
  },

  // Advanced Configuration
  spacing: 8, // 8px grid system

  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 6px 12px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.06)',
    '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)',
    '0px 12px 24px rgba(0, 0, 0, 0.1), 0px 6px 12px rgba(0, 0, 0, 0.06)',
    '0px 16px 32px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.06)',
    '0px 20px 40px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.06)',
    '0px 24px 48px rgba(0, 0, 0, 0.1), 0px 12px 24px rgba(0, 0, 0, 0.06)',
    ...Array(16).fill('none'), // Fill remaining shadows with 'none' for flat design
  ],

  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },

  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;