import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Group,
  Face,
  Class,
  CoPresent
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [
    { title: "Total Guru", value: 58, icon: <Group /> },
    { title: "Total Siswa", value: 724, icon: <Face /> },
    { title: "Total Kelas", value: 24, icon: <Class /> },
    { title: "Absensi Hari Ini", value: "98.5%", icon: <CoPresent /> }
  ];

  // Mock data for weekly attendance chart
  const attendanceData = [
    { name: 'Senin', percentage: 95 },
    { name: 'Selasa', percentage: 92 },
    { name: 'Rabu', percentage: 98 },
    { name: 'Kamis', percentage: 96 },
    { name: 'Jumat', percentage: 94 },
    { name: 'Sabtu', percentage: 90 },
    { name: 'Minggu', percentage: 85 }
  ];

  // Mock data for e-Rapor progress chart
  const eraporData = [
    { name: 'Completed', value: 75 },
    { name: 'Pending', value: 25 }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', minWidth: '100vw' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Dasbor Admin</Typography>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* KPI Cards */}
        <Grid container sx={{ mb: 4, gap: 3 }}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box mr={1}>
                    {kpi.icon}
                  </Box>
                  <Typography variant="h6">{kpi.title}</Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {kpi.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        {/* Data Visualization Section */}
        <Grid container sx={{ gap: 3 }}>
          {/* Attendance Visualization */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tingkat Kehadiran Mingguan
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={attendanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#8884d8" name="Kehadiran (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* e-Rapor Progress */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Progres e-Rapor
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eraporData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {eraporData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;