import React from 'react';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';

const Alert = ({ 
  children, 
  title, 
  severity = 'info', 
  variant = 'standard', 
  onClose, 
  ...props 
}) => {
  return (
    <MuiAlert
      severity={severity}
      variant={variant}
      onClose={onClose}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

export default Alert;