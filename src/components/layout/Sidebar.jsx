import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, Typography } from '@mui/material';
import { 
  Dashboard, 
  School, 
  People, 
  Assessment, 
  Book, 
  Settings 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { text: 'Users', icon: <People />, path: '/admin/users' },
        { text: 'Courses', icon: <Book />, path: '/admin/courses' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
        { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
      ];
    } else if (user?.role === 'guru') {
      return [
        ...commonItems,
        { text: 'Classes', icon: <School />, path: '/dashboard/guru/classes' },
        { text: 'Students', icon: <People />, path: '/dashboard/guru/students' },
        { text: 'Grades', icon: <Assessment />, path: '/buku-nilai' },
      ];
    } else if (user?.role === 'siswa') {
      return [
        ...commonItems,
        { text: 'Courses', icon: <Book />, path: '/dashboard/siswa/courses' },
        { text: 'Grades', icon: <Assessment />, path: '/dashboard/siswa/grades' },
      ];
    } else if (user?.role === 'ortu') {
      return [
        ...commonItems,
        { text: 'Student Progress', icon: <Assessment />, path: '/portal/ortu/progress' },
        { text: 'Grades', icon: <School />, path: '/portal/ortu/grades' },
      ];
    }
    
    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;