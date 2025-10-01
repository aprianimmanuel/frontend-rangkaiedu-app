import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error, 
  helperText, 
  fullWidth = true, 
  variant = 'outlined', 
  margin = 'normal',
  required = false,
  ...props 
}) => {
  return (
    <FormControl fullWidth={fullWidth} margin={margin} error={error}>
      {label && (
        <InputLabel required={required}>{label}</InputLabel>
      )}
      <MuiSelect
        value={value}
        onChange={onChange}
        variant={variant}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;