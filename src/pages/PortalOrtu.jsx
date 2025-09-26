import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Card,
  CardActionArea,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  FamilyRestroom,
  AdminPanelSettings,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function PortalOrtu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loading: authLoading } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const backendRoleMap = {
    parent: 'ortu',
    teacher: 'guru',
    admin: 'admin',
  };

  const roleTitles = {
    parent: 'Orang Tua / Wali',
    teacher: 'Guru',
    admin: 'Admin Sekolah',
  };

  const roleDescs = {
    parent: 'Lihat nilai dan perkembangan anak Anda secara real-time.',
    teacher: 'Input nilai, kelola kelas, dan hubungkan e-Rapor dengan mudah.',
    admin: 'Kelola data master sekolah, guru, dan siswa secara terpusat.',
  };

  const roles = [
    {
      key: 'parent',
      icon: FamilyRestroom,
      title: roleTitles.parent,
      desc: roleDescs.parent,
      backend: backendRoleMap.parent,
    },
    {
      key: 'teacher',
      icon: School,
      title: roleTitles.teacher,
      desc: roleDescs.teacher,
      backend: backendRoleMap.teacher,
    },
    {
      key: 'admin',
      icon: AdminPanelSettings,
      title: roleTitles.admin,
      desc: roleDescs.admin,
      backend: backendRoleMap.admin,
    },
  ];

  const generateMockToken = (role) => {
    const payload = { role, exp: Math.floor(Date.now() / 1000) + 3600 };
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payloadB64 = btoa(JSON.stringify(payload));
    return `${header}.${payloadB64}.mock`;
  };

  const switchRole = async (roleKey) => {
    const currentRole = user?.role;
    if (roleKey === currentRole) return;

    setIsSwitching(true);
    try {
      const backendRole = backendRoleMap[roleKey];
      await api.post('/auth/verify-role', { role: backendRole });
      const mockToken = generateMockToken(backendRole);
      await login(mockToken);

      let targetPath;
      if (roleKey === 'parent') {
        targetPath = '/portal/parent';
      } else if (roleKey === 'teacher') {
        targetPath = '/dashboard/guru';
      } else if (roleKey === 'admin') {
        targetPath = '/admin';
      }

      if (targetPath && targetPath !== location.pathname) {
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    const isDev = import.meta.env.DEV;
    if (isDev && !user && !authLoading) {
      const defaultRoleKey = 'parent';
      const backendRole = backendRoleMap[defaultRoleKey];
      const mockToken = generateMockToken(backendRole);
      login(mockToken);
    }
  }, [user, authLoading, login]);

  return (
    <Box
      sx={{
        minWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="h1" color="inherit">
              Portal Orang Tua
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              Pantau Perkembangan Akademik Anak Anda
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{ flex: 1, py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
      >
        {/* Student Profile Header */}
        <Paper
          elevation={2}
          sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2 }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            direction={{ xs: 'column', sm: 'row' }}
          >
            <Grid item xs={12} sm={3}>
              <Avatar
                sx={{
                  width: { xs: 56, md: 80 },
                  height: { xs: 56, md: 80 },
                  mx: 'auto',
                  mb: { xs: 1, sm: 0 },
                }}
              >
                BH
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography variant="h4" component="h2" gutterBottom>
                Budi Hartono
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SchoolIcon />
                Kelas 7A - Tahun Ajaran 2025/2026
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Academic Summary Section */}
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Rangkuman Nilai Akademik
        </Typography>
        <Stack spacing={2}>
          {/* Matematika Accordion */}
          <Accordion sx={{ boxShadow: 1, borderRadius: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">Matematika</Typography>
                <Chip label="Rata-rata: 88" color="success" variant="outlined" size="small" />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Penilaian</TableCell>
                      <TableCell align="right">Nilai</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tugas 1</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>85</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UTS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>90</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UAS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>88</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rata-rata</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>88</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Bahasa Indonesia Accordion */}
          <Accordion sx={{ boxShadow: 1, borderRadius: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">Bahasa Indonesia</Typography>
                <Chip label="Rata-rata: 91" color="success" variant="outlined" size="small" />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Penilaian</TableCell>
                      <TableCell align="right">Nilai</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tugas 1</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>92</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UTS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>87</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UAS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>95</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rata-rata</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>91</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          {/* Ilmu Pengetahuan Alam Accordion */}
          <Accordion sx={{ boxShadow: 1, borderRadius: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">Ilmu Pengetahuan Alam</Typography>
                <Chip label="Rata-rata: 82" color="warning" variant="outlined" size="small" />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Penilaian</TableCell>
                      <TableCell align="right">Nilai</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tugas 1</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>78</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UTS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>82</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UAS</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>85</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rata-rata</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>82</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Stack>

        {/* Footer Summary Card */}
        <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Overall Progress
          </Typography>
          <Chip label="GPA: 87/100" color="primary" size="large" />
        </Paper>
      </Container>
    </Box>
  );
}

export default PortalOrtu;