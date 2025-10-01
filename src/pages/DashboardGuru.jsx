import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FamilyRestroom, School, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const DashboardGuru = ({ teacherName = 'Bapak/Ibu Guru' }) => {
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

  const switchRole = async (roleKey) => {
    const currentRole = user?.role;
    if (roleKey === currentRole) return;

    setIsSwitching(true);
    try {
      const backendRole = backendRoleMap[roleKey];
      await api.post('/auth/verify-role', { role: backendRole });
      const mockToken = `mock-${backendRole}-token`;
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
      let defaultRoleKey = 'teacher'; // default
      if (location.pathname === '/admin') {
        defaultRoleKey = 'admin';
      } else if (location.pathname === '/dashboard/guru') {
        defaultRoleKey = 'teacher';
      }
      const backendRole = backendRoleMap[defaultRoleKey];
      const mockToken = `mock-${backendRole}-token`;
      login(mockToken);
    }
  }, [user, authLoading, location.pathname, login]);

  // Sample data for the summary cards
  const summaryData = [
    { id: 1, title: 'Jumlah Kelas', value: 5 },
    { id: 2, title: 'Siswa Aktif', value: 124 },
    { id: 3, title: 'Tugas Mendatang', value: 8 },
  ];

  // Sample data for the classes table
  const classRows = [
    { id: 1, namaKelas: 'Kelas 10A - IPA', mataPelajaran: 'Fisika', jumlahSiswa: 32 },
    { id: 2, namaKelas: 'Kelas 11B - IPS', mataPelajaran: 'Ekonomi', jumlahSiswa: 28 },
    { id: 3, namaKelas: 'Kelas 12A - Bahasa', mataPelajaran: 'Bahasa Inggris', jumlahSiswa: 30 },
    { id: 4, namaKelas: 'Kelas 10C - IPA', mataPelajaran: 'Kimia', jumlahSiswa: 34 },
  ];

  // Columns for the DataGrid
  const columns = [
    { field: 'namaKelas', headerName: 'Nama Kelas', flex: 1, minWidth: 150 },
    { field: 'mataPelajaran', headerName: 'Mata Pelajaran', flex: 1, minWidth: 150 },
    { field: 'jumlahSiswa', headerName: 'Jumlah Siswa', type: 'number', width: 120 },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          aria-label="lihat detail kelas"
          onClick={() => console.log('View class details for:', params.row.namaKelas)}
        >
          <VisibilityOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ minWidth: '100vw', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="dynamic">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dasbor Guru
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadOutlinedIcon />}
          >
            Ekspor e-Rapor
          </Button>
        </Toolbar>
      </AppBar>

      <Accordion sx={{ mx: 2, mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ganti Peran</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container sx={{ gap: 2 }}>
            {roles.map((role) => (
              <Grid item xs={12} sm={4} key={role.key}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    opacity: role.key === user?.role ? 0.6 : 1,
                  }}
                  onClick={() => switchRole(role.key)}
                  disabled={isSwitching}
                >
                  <CardActionArea disabled={isSwitching || role.key === user?.role}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                      <role.icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {role.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {role.desc}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {import.meta.env.DEV && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }}>
            <Typography variant="h6" gutterBottom>Dev Tools: Mock Login</Typography>
            <Grid container sx={{ gap: 2 }}>
              {roles.map((role) => (
                <Grid item key={role.key}>
                  <Button
                    variant="outlined"
                    onClick={() => switchRole(role.key)}
                    disabled={isSwitching || role.key === user?.role}
                  >
                    Mock {role.title} Login
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Welcome Section */}
        <Typography variant="h5" gutterBottom>
          Halo, {teacherName}!
        </Typography>

        {/* Summary Cards */}
        <Grid container sx={{ mb: 4, mt: 2, gap: 3 }}>
          {summaryData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h3" component="div">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Classes Table */}
        <Typography variant="h6" gutterBottom>
          Daftar Kelas Anda
        </Typography>
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <DataGrid
            autoHeight
            rows={classRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableColumnFilter
            disableColumnMenu
          />
        </Box>

        {location.pathname === '/admin' && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Manajemen Pengguna
            </Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Pengguna</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Guru A</TableCell>
                      <TableCell>Guru</TableCell>
                      <TableCell>guru@example.com</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Admin B</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>admin@example.com</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default DashboardGuru;