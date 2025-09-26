import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import DashboardGuru from './pages/DashboardGuru';
import LoginPage from './pages/LoginPage';
import PortalOrtu from './pages/PortalOrtu';
import DashboardSiswa from './pages/DashboardSiswa';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/portal/parent" element={<PortalOrtu />} />
              <Route path="/dashboard/guru" element={<DashboardGuru />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/siswa" element={<DashboardSiswa />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;