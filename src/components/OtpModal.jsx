import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../utils/api';

const OtpModal = ({ open, phone, onClose, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/whatsapp-otp/verify', {
        phone,
        otp,
      });
      const { token, user } = response.data;
      onSuccess(token, user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Enter the 6-digit OTP sent to {phone}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            inputProps={{ maxLength: 6 }}
            disabled={loading}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleVerify} variant="contained" disabled={loading || otp.length !== 6}>
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpModal;