import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Rating,
  Switch,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  AutoStories as AutoStoriesIcon,
  Visibility as VisibilityIcon,
  Stars as StarsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  PlayArrow as PlayArrowIcon,
  Person as PersonIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';

// HomePage component: Main landing page for Rangkai Edu LMS
// Self-contained, responsive, uses MUI theme, mock data, lightweight animations
const HomePage = () => {
  // State for scroll effect on AppBar and mobile drawer
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Effect to handle scroll listener for AppBar changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileOpen(open);
  };

  // Handle smooth scroll navigation
  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false); // Close drawer on mobile
  };

  // Language switcher handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {['features', 'solutions', 'testimonials', 'pricing'].map((key, index) => (
          <ListItem key={key} disablePadding>
            <ListItemButton onClick={() => handleNavClick(key)}>
              <ListItemText primary={t(`nav.${key}`)} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton component="a" href="/login">
            <ListItemText primary={t('nav.login')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/register">
            <ListItemText primary={t('nav.register')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
{/* TEMPORARY: Debug navigation for development - remove before production. */}
<Box sx={{ p: 2, bgcolor: 'grey.100', mb: 2 }}>
  <Typography variant="h6" gutterBottom>Debug Navigation</Typography>
  <Grid container spacing={1}>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/" variant="outlined" fullWidth sx={{ mb: 1 }}>Home (/)</Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/login" variant="outlined" fullWidth sx={{ mb: 1 }}>Login (/login)</Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/portal/parent" variant="outlined" fullWidth sx={{ mb: 1 }}>Parent Portal (/portal/parent)</Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/dashboard/guru" variant="outlined" fullWidth sx={{ mb: 1 }}>Guru Dashboard (/dashboard/guru)</Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/admin" variant="outlined" fullWidth sx={{ mb: 1 }}>Admin (/admin)</Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button component={Link} to="/dashboard/siswa" variant="outlined" fullWidth sx={{ mb: 1 }}>Siswa Dashboard (/dashboard/siswa)</Button>
    </Grid>
  </Grid>
</Box>
      {/* Sticky AppBar with scroll effect */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          transition: 'all 0.3s ease-in-out',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          backgroundColor: scrolled ? 'background.paper' : 'transparent',
          boxShadow: scrolled ? 1 : 0,
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              flexGrow: 1,
            }}
          >
            {t('logo')}
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, flexGrow: 1, justifyContent: 'center' }}>
            <Button color="inherit" onClick={() => handleNavClick('features')} sx={{ backgroundColor: 'transparent', border: 'none', '&:hover': { backgroundColor: 'transparent' }, color: scrolled ? 'text.primary' : 'black' }}>
              {t('nav.features')}
            </Button>
            <Button color="inherit" onClick={() => handleNavClick('solutions')} sx={{ backgroundColor: 'transparent', border: 'none', '&:hover': { backgroundColor: 'transparent' }, color: scrolled ? 'text.primary' : 'black' }}>
              {t('nav.solutions')}
            </Button>
            <Button color="inherit" onClick={() => handleNavClick('testimonials')} sx={{ backgroundColor: 'transparent', border: 'none', '&:hover': { backgroundColor: 'transparent' }, color: scrolled ? 'text.primary' : 'black' }}>
              {t('nav.testimonials')}
            </Button>
            <Button color="inherit" onClick={() => handleNavClick('cta')} sx={{ backgroundColor: 'transparent', border: 'none', '&:hover': { backgroundColor: 'transparent' }, color: scrolled ? 'text.primary' : 'black' }}>
              {t('nav.pricing')}
            </Button>
          </Box>

          {/* Language Switcher - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 30, color: scrolled ? 'text.primary' : 'white' }}>
              EN
            </Typography>
            <Switch
              checked={i18n.language === 'id'}
              onChange={(e) => changeLanguage(e.target.checked ? 'id' : 'en')}
              color="primary"
              size="small"
            />
            <Typography variant="body2" sx={{ minWidth: 30, color: scrolled ? 'text.primary' : 'white' }}>
              ID
            </Typography>
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, md: 'auto' } }}>
            <Button variant="outlined" color="inherit" href="/login" sx={{ color: scrolled ? 'text.primary' : 'blue', borderColor: scrolled ? 'text.primary' : 'blue' }}>
              {t('nav.login')}
            </Button>
            <Button variant="contained" color="primary" href="/register">
              {t('nav.register')}
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
          {/* Hero Content */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 500, flex: 1 }}>
            <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              {t('hero.title')}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {t('hero.description')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button variant="contained" size="large" color="secondary" href="/register">
                {t('hero.cta1')}
              </Button>
              <Button variant="outlined" size="large" startIcon={<PlayArrowIcon />} sx={{ color: 'white', borderColor: 'white' }}>
                {t('hero.cta2')}
              </Button>
            </Box>
          </Box>

          {/* Hero Visual Placeholder */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Paper
              sx={{
                p: 4,
                maxWidth: 400,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <SchoolIcon sx={{ fontSize: 100, color: 'white', mx: 'auto', display: 'block', mb: 2 }} />
              <Typography variant="body1">Product Mockup Placeholder</Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 12, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'text.primary' }}>
            {t('features.title')}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Feature 1 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                    <AutoStoriesIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('features.card1.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('features.card1.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Feature 2 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.main', width: 60, height: 60 }}>
                    <VisibilityIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('features.card2.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('features.card2.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Feature 3 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'warning.main', width: 60, height: 60 }}>
                    <StarsIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('features.card3.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('features.card3.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Feature 4 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'info.main', width: 60, height: 60 }}>
                    <AdminPanelSettingsIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('features.card4.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('features.card4.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'text.primary' }}>
            {t('testimonials.title')}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Testimonial 1 */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={5} readOnly size="small" />
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, fontSize: '1.1rem' }}>
                      {t('testimonials.testimonial1.quote')}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {t('testimonials.testimonial1.author')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Testimonial 2 */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={5} readOnly size="small" />
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, fontSize: '1.1rem' }}>
                      {t('testimonials.testimonial2.quote')}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {t('testimonials.testimonial2.author')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section - Used as pricing placeholder */}
      <Box
        id="cta"
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
            {t('cta.title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {t('cta.description')}
          </Typography>
          <Button variant="contained" size="large" color="secondary" href="/register">
            {t('cta.button')}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Column 1: Produk */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                {t('footer.products')}
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#features" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.features')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#features" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.solutions')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.integrations')} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
            {/* Column 2: Perusahaan */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                {t('footer.company')}
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.about')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.careers')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.blog')} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
            {/* Column 3: Legal */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                {t('footer.legal')}
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.privacy')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.terms')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component="a" href="#" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary={t('footer.contact')} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
            {/* Column 4: Company Info & Social */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                {t('logo')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                {t('footer.description')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          {/* Copyright */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {t('footer.copyright')}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;