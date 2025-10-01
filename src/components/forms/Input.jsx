import React from 'react';
import { TextField, FormControl, FormHelperText, InputLabel } from '@mui/material';

const Input = ({ 
  label, 
  value, 
  onChange, 
  error, 
  helperText, 
  fullWidth = true, 
  variant = 'outlined', 
  margin = 'normal',
  required = false,
  type = 'text',
  ...props 
}) => {
  return (
    <FormControl fullWidth={fullWidth} margin={margin} error={error}>
      {label && (
        <InputLabel required={required}>{label}</InputLabel>
      )}
      <TextField
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        variant={variant}
        required={required}
        type={type}
        {...props}
      />
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Input;