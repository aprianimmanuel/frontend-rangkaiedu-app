import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  onClick, 
  disabled = false,
  startIcon,
  endIcon,
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;