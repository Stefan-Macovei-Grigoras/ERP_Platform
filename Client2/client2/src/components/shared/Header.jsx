import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Settings,
  Logout,
  Circle
} from '@mui/icons-material';

// Mock notifications - replace with API call
const mockNotifications = [
  { id: 1, title: 'Low Stock Alert', message: 'Milk supply is running low', read: false, type: 'warning' },
  { id: 2, title: 'Batch Completed', message: 'Batch #BT-001 completed successfully', read: false, type: 'success' },
  { id: 3, title: 'User Added', message: 'New user Maria Popescu added', read: true, type: 'info' }
];

function Header({ title, currentPage, drawerWidth, onDrawerToggle, userRole = 'admin' }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  // Get page title based on current page
  const getPageTitle = () => {
    const pageTitles = {
      overview: 'Dashboard Overview',
      users: 'User Management',
      products: 'Product Catalog',
      inventory: 'Inventory Management',
      batches: 'Batch Management',
      // reports: 'Reports & Analytics',
      // settings: 'System Settings'
    };
    return pageTitles[currentPage] || title;
  };

  // Handle notification menu
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // Handle profile menu
  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  // Mark notification as read
  const handleNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Get header color based on user role
  const getHeaderColor = () => {
    switch(userRole) {
      case 'admin': return '#1976d2';
      case 'factory': return '#2e7d32';
      case 'packaging': return '#9c27b0';
      default: return '#1976d2';
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: getHeaderColor()
      }}
    >
      <Toolbar>
        {/* Mobile menu button - only visible on mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>

        <Box sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            px: 2, 
            py: 0.5, 
            borderRadius: 1,
            textTransform: 'capitalize'
          }}>
            {userRole}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;