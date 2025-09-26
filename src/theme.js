// Import necessary modules from MUI
import { createTheme } from '@mui/material/styles';

// Import Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@700&display=swap" rel="stylesheet">

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

  // Typography System
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.45,
    },
    body1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    subtitle1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    caption: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.33,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: 1.33,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
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