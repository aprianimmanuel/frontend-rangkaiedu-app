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
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Badge,
  Avatar,
} from '@mui/material';
import {
  MilitaryTech,
  WorkspacePremium,
  Science,
  MenuBook,
  EmojiEvents,
} from '@mui/icons-material';

const DashboardSiswa = () => {
  // Mock data
  const studentName = "Siti Nurhaliza";
  
  const upcomingAssignments = [
    { subject: "Matematika", task: "Latihan Aljabar", dueDate: "30 Sep 2025" },
    { subject: "IPA", task: "Laporan Praktikum", dueDate: "5 Okt 2025" },
    { subject: "Bahasa Indonesia", task: "Esai Naratif", dueDate: "10 Okt 2025" }
  ];
  
  const todaySchedule = [
    { time: "08:00", subject: "IPA", icon: <Science /> },
    { time: "09:30", subject: "Bahasa Indonesia", icon: <MenuBook /> },
    { time: "11:00", subject: "Matematika", icon: <MenuBook /> },
    { time: "13:00", subject: "Olahraga", icon: <EmojiEvents /> }
  ];
  
  const recentScores = [
    { subject: "Matematika", assessment: "UTS", score: 88 },
    { subject: "IPA", assessment: "Tugas", score: 92 },
    { subject: "Bahasa Indonesia", assessment: "Kuis", score: 75 },
    { subject: "Sejarah", assessment: "Presentasi", score: 85 }
  ];

  return (
    <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', minWidth: '100vw' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Dasbor Siswa</Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome & Gamification Header */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Welcome Message */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Halo, {studentName}!</Typography>
            <Typography variant="body1" color="text.secondary">
              "Terus semangat, setiap langkah kecil adalah kemajuan!"
            </Typography>
          </Grid>
          
          {/* Gamification Stats */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">Level 12</Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress variant="determinate" value={75} />
                  <Typography variant="body2" color="text.secondary" align="right">
                    750/1000 XP ke Level 13
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Lencana:</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Badge badgeContent="3" color="primary">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <MilitaryTech />
                      </Avatar>
                    </Badge>
                    <Badge badgeContent="5" color="secondary">
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <WorkspacePremium />
                      </Avatar>
                    </Badge>
                    <Badge badgeContent="7" color="success">
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <EmojiEvents />
                      </Avatar>
                    </Badge>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Core Information Grid */}
        <Grid container spacing={3}>
          {/* Tugas Mendatang */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardHeader title="Tugas Mendatang" />
              <CardContent>
                <List>
                  {upcomingAssignments.map((assignment, index) => (
                    <ListItem key={index} divider={index !== upcomingAssignments.length - 1}>
                      <ListItemText 
                        primary={`${assignment.subject} - ${assignment.task}`} 
                        secondary={`Tenggat: ${assignment.dueDate}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Jadwal Hari Ini */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title="Jadwal Hari Ini" />
              <CardContent>
                <List>
                  {todaySchedule.map((schedule, index) => (
                    <ListItem key={index} divider={index !== todaySchedule.length - 1}>
                      <ListItemIcon>
                        {schedule.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={schedule.subject} 
                        secondary={schedule.time} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Nilai Terbaru Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Nilai Terbaru</Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {recentScores.map((score, index) => (
            <Paper key={index} sx={{ minWidth: 200, p: 2, flexShrink: 0 }}>
              <Typography variant="subtitle1">{score.subject}</Typography>
              <Typography variant="body2" color="text.secondary">
                {score.assessment}: {score.score}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={score.score} 
                  color={score.score >= 80 ? "success" : score.score >= 60 ? "warning" : "error"} 
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardSiswa;