import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Switch,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardActionArea,
  Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import OtpModal from '../components/OtpModal';
import ReactLogo from '../assets/react.svg';
import { FamilyRestroom, School, AdminPanelSettings } from '@mui/icons-material';

// Mock GoogleLogin component
const MockGoogleLogin = ({ onSuccess, onError }) => (
  <Button
    fullWidth
    variant="outlined"
    size="large"
    onClick={() => {
      // Simulate success with mock credential
      onSuccess({ credential: 'mock-google-token' });
    }}
    sx={{ py: { xs: 1.5, sm: 2 } }}
  >
    Sign in with Google
  </Button>
);

// Mock AppleLoginButton component
const MockAppleLoginButton = ({ onSuccess, onError }) => (
  <Button
    fullWidth
    variant="outlined"
    size="large"
    onClick={() => {
      // Simulate success with mock token
      onSuccess({ identityToken: 'mock-apple-token' });
    }}
    sx={{ py: { xs: 1.5, sm: 2 } }}
  >
    Sign in with Apple
  </Button>
);

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();

  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [phone, setPhone] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const backendRoleMap = {
    parent: 'ortu',
    teacher: 'guru',
    admin: 'admin',
  };

  const roleDisplays = {
    parent: { en: 'Parent', id: 'Orang Tua / Wali' },
    admin: { en: 'School Admin', id: 'Admin Sekolah' },
    teacher: { en: 'Teacher', id: 'Guru' },
  };

  const roleDescs = {
    parent: { en: "View your child's grades and progress in real-time.", id: 'Lihat nilai dan perkembangan anak Anda secara real-time.' },
    teacher: { en: 'Input grades, manage classes, and connect e-Report easily.', id: 'Input nilai, kelola kelas, dan hubungkan e-Rapor dengan mudah.' },
    admin: { en: 'Manage school master data, teachers, and students centrally.', id: 'Kelola data master sekolah, guru, dan siswa secara terpusat.' },
  };

  const getDisplay = (key) => roleDisplays[key]?.[language] || key.charAt(0).toUpperCase() + key.slice(1);

  const getDesc = (key) => roleDescs[key]?.[language] || '';

  const welcomeTitle = language === 'en' ? "Welcome to Rangkaiedu" : "Selamat Datang di Rangkaiedu";
  const welcomeSubtitle = language === 'en' ? "Choose your role to get started" : "Pilih peran Anda untuk memulai";

  useEffect(() => {
    if (isAuthenticated && user) {
      let redirectPath;
      if (user.role === 'ortu') {
        redirectPath = '/portal/parent';
      } else if (user.role === 'guru') {
        redirectPath = '/dashboard/guru';
      } else if (user.role === 'admin') {
        redirectPath = '/admin';
      } else {
        redirectPath = '/dashboard';
      }
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validatePhone = (phoneNum) => phoneNum.startsWith('+62') && phoneNum.length >= 12 && phoneNum.length <= 15;

  const verifyRole = async (roleKey) => {
    if (!roleKey) return;
    setLoading(true);
    setSnackbar({ open: false });
    try {
      const backendRole = backendRoleMap[roleKey];
      const response = await api.post('/auth/verify-role', { role: backendRole });
      if (response.data.success) {
        setSelectedRole(roleKey);
      } else {
        throw new Error('Role verification failed');
      }
    } catch (error) {
      console.error('Role verification error:', error);
      setSnackbar({
        open: true,
        message: language === 'en' ? 'Role verification failed. Please try again.' : 'Verifikasi peran gagal. Silakan coba lagi.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSend = async () => {
    if (!validatePhone(phone)) {
      const message = language === 'en' ? 'Please enter a valid Indonesian phone number starting with +62' : 'Masukkan nomor telepon Indonesia yang valid dimulai dengan +62';
      setSnackbar({ open: true, message, severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/whatsapp-otp/send', { phone, role: backendRoleMap[selectedRole] });
      setOtpModalOpen(true);
    } catch (err) {
      const message = err.response?.data?.message || (language === 'en' ? 'Failed to send OTP' : 'Gagal mengirim OTP');
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppVerify = async (otp) => {
    try {
      const res = await api.post('/auth/whatsapp-otp/verify', { phone, otp, role: backendRoleMap[selectedRole] });
      login(res.data.token);
    } catch (err) {
      const message = err.response?.data?.message || (language === 'en' ? 'Invalid OTP' : 'OTP tidak valid');
      setSnackbar({ open: true, message, severity: 'error' });
    }
    setOtpModalOpen(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      let token;
      if (credentialResponse.credential === 'mock-google-token') {
        const mockUser = { name: `Mock ${getDisplay(selectedRole)}`, role: backendRoleMap[selectedRole] };
        const headerObj = { typ: 'JWT', alg: 'HS256' };
        const payloadObj = { user: mockUser };
        const header = btoa(JSON.stringify(headerObj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const payload = btoa(JSON.stringify(payloadObj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const signature = btoa(JSON.stringify({ sig: 'mock' })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        token = `${header}.${payload}.${signature}`;
      } else {
        const res = await api.post('/auth/google', { id_token: credentialResponse.credential, role: backendRoleMap[selectedRole] });
        token = res.data.token;
      }
      login(token);
    } catch (err) {
      const message = err.response?.data?.message || err.message || (language === 'en' ? 'Google login failed' : 'Login Google gagal');
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const message = language === 'en' ? 'Google login cancelled' : 'Login Google dibatalkan';
    setSnackbar({ open: true, message, severity: 'warning' });
  };

  const handleAppleSuccess = async (response) => {
    setLoading(true);
    try {
      let token;
      if (response.identityToken === 'mock-apple-token') {
        const mockUser = { name: `Mock ${getDisplay(selectedRole)}`, role: backendRoleMap[selectedRole] };
        const headerObj = { typ: 'JWT', alg: 'HS256' };
        const payloadObj = { user: mockUser };
        const header = btoa(JSON.stringify(headerObj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const payload = btoa(JSON.stringify(payloadObj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const signature = btoa(JSON.stringify({ sig: 'mock' })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        token = `${header}.${payload}.${signature}`;
      } else {
        const res = await api.post('/auth/apple', { id_token: response.identityToken, role: backendRoleMap[selectedRole] });
        token = res.data.token;
      }
      login(token);
    } catch (err) {
      const message = err.response?.data?.message || err.message || (language === 'en' ? 'Apple login failed' : 'Login Apple gagal');
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleError = () => {
    const message = language === 'en' ? 'Apple login cancelled' : 'Login Apple dibatalkan';
    setSnackbar({ open: true, message, severity: 'warning' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const roles = [
    {
      key: 'parent',
      icon: FamilyRestroom,
      titleKey: 'parent',
      descKey: 'parent',
      delay: 0
    },
    {
      key: 'teacher',
      icon: School,
      titleKey: 'teacher',
      descKey: 'teacher',
      delay: 200
    },
    {
      key: 'admin',
      icon: AdminPanelSettings,
      titleKey: 'admin',
      descKey: 'admin',
      delay: 400
    }
  ];

  if (!selectedRole) {
    return (
      <>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: {
              xs: theme.spacing(2),
              sm: theme.spacing(3),
              md: theme.spacing(4),
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              minWidth: 280,
              maxWidth: {
                xs: '100%',
                sm: 400,
                md: 450,
                lg: 500,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: {
                  xs: theme.spacing(3),
                  sm: theme.spacing(4),
                  md: theme.spacing(5),
                },
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                width: '100%',
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  width: {
                    xs: '25vw',
                    sm: '20vw',
                    md: 120,
                  },
                  height: {
                    xs: '25vw',
                    sm: '20vw',
                    md: 120,
                  },
                  maxWidth: {
                    xs: 100,
                    sm: 120,
                    md: 150,
                  },
                  maxHeight: {
                    xs: 100,
                    sm: 120,
                    md: 150,
                  },
                  borderRadius: '50%',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={ReactLogo}
                  alt="Rangkaiedu Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Stack direction="row" alignItems="center" spacing={1} sx={{width: '100%', justifyContent: 'flex-end', mb: 2}}>
                <Typography variant="body2" color="text.secondary">EN</Typography>
                <Switch
                  checked={language === 'id'}
                  onChange={(e) => setLanguage(e.target.checked ? 'id' : 'en')}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">ID</Typography>
              </Stack>

              <Typography
                component="h1"
                variant="h3"
                sx={{
                  mb: 1,
                  fontSize: {
                    xs: '2rem',
                    sm: '2.25rem',
                    md: '2.5rem',
                  },
                  textAlign: 'center',
                }}
              >
                {welcomeTitle}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontSize: {
                    xs: '1rem',
                    sm: '1.125rem',
                    md: '1.25rem',
                  },
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                {welcomeSubtitle}
              </Typography>

              {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}

              <Grid container spacing={2} justifyContent="center" sx={{ mt: 2, width: '100%' }}>
                {roles.map((role, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Fade in={!loading} timeout={600} style={{ transitionDelay: `${role.delay}ms` }}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 1,
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 3,
                          textAlign: 'center',
                          '&:hover': {
                            boxShadow: 3,
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        <CardActionArea
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                          }}
                          onClick={() => verifyRole(role.key)}
                          disabled={loading}
                        >
                          <role.icon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                            {getDisplay(role.key)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {getDesc(role.key)}
                          </Typography>
                        </CardActionArea>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  const backendRole = backendRoleMap[selectedRole];

  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: {
            xs: theme.spacing(2),
            sm: theme.spacing(3),
            md: theme.spacing(4),
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            minWidth: 280,
            maxWidth: {
              xs: '100%',
              sm: 400,
              md: 450,
              lg: 500,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: {
                xs: theme.spacing(3),
                sm: theme.spacing(4),
                md: theme.spacing(5),
              },
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              width: '100%',
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                width: {
                  xs: '25vw',
                  sm: '20vw',
                  md: 120,
                },
                height: {
                  xs: '25vw',
                  sm: '20vw',
                  md: 120,
                },
                maxWidth: {
                  xs: 100,
                  sm: 120,
                  md: 150,
                },
                maxHeight: {
                  xs: 100,
                  sm: 120,
                  md: 150,
                },
                borderRadius: '50%',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={ReactLogo}
                alt="Rangkaiedu Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} sx={{width: '100%', justifyContent: 'flex-end', mb: 2}}>
              <Typography variant="body2" color="text.secondary">EN</Typography>
              <Switch
                checked={language === 'id'}
                onChange={(e) => setLanguage(e.target.checked ? 'id' : 'en')}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">ID</Typography>
            </Stack>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.75rem',
                  md: '2rem',
                },
                textAlign: 'center',
              }}
            >
              {language === 'en' ? `Login as ${getDisplay(selectedRole)}` : `Masuk sebagai ${getDisplay(selectedRole)}`}
            </Typography>
            {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
            <Stack spacing={2} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label={language === 'en' ? 'Phone Number' : 'Nomor Telepon'}
                placeholder="+62..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!validatePhone(phone)}
                helperText={
                  !validatePhone(phone) && phone
                    ? language === 'en'
                      ? 'Enter valid Indonesian number (e.g., +6281234567890)'
                      : 'Masukkan nomor Indonesia yang valid'
                    : ''
                }
                disabled={loading}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleWhatsAppSend}
                disabled={!validatePhone(phone) || loading}
                sx={{
                  py: {
                    xs: 1.5,
                    sm: 2,
                  },
                }}
              >
                {language === 'en' ? 'Send OTP via WhatsApp' : 'Kirim OTP via WhatsApp'}
              </Button>
              <MockGoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              <MockAppleLoginButton
                onSuccess={handleAppleSuccess}
                onError={handleAppleError}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
      <OtpModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleWhatsAppVerify}
        phone={phone}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;