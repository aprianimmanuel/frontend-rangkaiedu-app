/* Deprecated: Integrated into LoginPage.jsx */

import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardActionArea, Typography, Fade, Stack, Switch, Snackbar, Alert } from '@mui/material';
import { FamilyRestroom, School, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../utils/api';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { role: roleParam } = useParams();
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [selectedRole, setSelectedRole] = useState(roleParam || null);

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
    teacher: { en: 'Teacher', id: 'Guru' },
    admin: { en: 'School Admin', id: 'Admin Sekolah' },
  };

  const roleDescs = {
    parent: { en: 'View your child\'s grades and progress in real-time.', id: 'Lihat nilai dan perkembangan anak Anda secara real-time.' },
    teacher: { en: 'Input grades, manage classes, and connect e-Report easily.', id: 'Input nilai, kelola kelas, dan hubungkan e-Rapor dengan mudah.' },
    admin: { en: 'Manage school master data, teachers, and students centrally.', id: 'Kelola data master sekolah, guru, dan siswa secara terpusat.' },
  };

  const getDisplay = (key, type = 'title') => {
    if (type === 'title') {
      return roleDisplays[key]?.[language] || key.charAt(0).toUpperCase() + key.slice(1);
    } else {
      return roleDescs[key]?.[language] || '';
    }
  };

  const titleText = language === 'en' ? 'Select Role' : 'Masuk sebagai:';
  const appTitle = 'Rangka Edu'; // Same in both

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const verifyRole = async (roleKey) => {
    if (!roleKey) return;
    setLoading(true);
    setSnackbar({ open: false });
    try {
      const backendRole = backendRoleMap[roleKey];
      const response = await api.post('/auth/verify-role', { role: backendRole });
      if (response.data.success) {
        setSelectedRole(roleKey);
        navigate(`/login/${roleKey}`);
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

  useEffect(() => {
    if (roleParam && !loading) {
      verifyRole(roleParam);
    }
  }, [roleParam]);

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

  const handleRoleSelect = (roleKey) => {
    navigate(`/roles/${roleKey}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom>
          Rangkai Edu
        </Typography>
        <Typography variant="h5" align="center" sx={{ my: 4 }}>
          Masuk sebagai:
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in={true} timeout={600} style={{ transitionDelay: `${role.delay}ms` }}>
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
                    role="button"
                    onClick={() => handleNavigate(role.path)}
                    aria-label={`Select ${role.title} role`}
                  >
                    <role.icon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                      {role.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {role.desc}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ mt: 'auto', pb: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Powered by Rangkai Edu
        </Typography>
      </Box>
    </Box>
  );
};

export default RoleSelection;