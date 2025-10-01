import React from 'react';
import { Button } from '@mui/material';
import { Facebook } from '@mui/icons-material';

const MockFacebookLogin = ({ onSuccess, onError }) => {
  const handleSuccess = () => {
    // In a real implementation, this would be replaced with actual Facebook login
    onSuccess({ accessToken: 'mock-facebook-token' });
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
      startIcon={<Facebook />}
      data-testid="mock-facebook-login-button"
      sx={{
        py: 1.5,
        backgroundColor: '#4267B2',
        '&:hover': {
          backgroundColor: '#365899',
        },
      }}
      aria-label="Mock Facebook Login for testing"
    >
      Mock Facebook Login
    </Button>
  );
};

export default MockFacebookLogin;