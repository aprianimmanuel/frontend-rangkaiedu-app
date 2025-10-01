import React from 'react';
import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';

const MockGoogleLogin = ({ onSuccess, onError }) => {
  const handleSuccess = () => {
    // In a real implementation, this would be replaced with actual Google login
    onSuccess({ credential: 'mock-google-token' });
  };

  const handleError = () => {
    onError();
  };

  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={handleSuccess}
      startIcon={<Google />}
      data-testid="mock-google-login-button"
      sx={{
        py: 1.5,
        backgroundColor: '#4285F4',
        '&:hover': {
          backgroundColor: '#3367D6',
        },
      }}
      aria-label="Mock Google Login for testing"
    >
      Mock Google Login
    </Button>
  );
};

export default MockGoogleLogin;