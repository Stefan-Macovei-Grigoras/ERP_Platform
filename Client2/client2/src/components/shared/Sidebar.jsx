import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  LocalDining,
  Assessment,
  Settings,
  Schedule,
  Work,
  PlayArrow,
  VerifiedUser,
  Build,
  TrendingUp,
  Print,
  LocalShipping
} from '@mui/icons-material';

// Menu items for different user roles
const menuItemsByRole = {
  admin: [
    { text: 'Overview', icon: <Dashboard />, path: 'overview' },
    { text: 'Users', icon: <People />, path: 'users' },
    { text: 'Products', icon: <LocalDining />, path: 'products' },
    { text: 'Inventory', icon: <Inventory />, path: 'inventory' },
    { text: 'All Batches', icon: <Schedule />, path: 'batches' },
    // { text: 'Reports', icon: <Assessment />, path: 'reports' },
    // { text: 'Settings', icon: <Settings />, path: 'settings' }
  ],
  factory: [
    { text: 'My Dashboard', icon: <Dashboard />, path: 'overview' },
    { text: 'My Batches', icon: <Schedule />, path: 'my-batches' },
    { text: 'Start Production', icon: <PlayArrow />, path: 'start-production' },
    { text: 'Quality Control', icon: <VerifiedUser />, path: 'quality' },
    { text: 'Equipment Status', icon: <Build />, path: 'equipment' },
    { text: 'My Performance', icon: <TrendingUp />, path: 'metrics' }
  ],
  packaging: [
    { text: 'My Dashboard', icon: <Dashboard />, path: 'overview' },
    { text: 'Packaging Queue', icon: <Inventory />, path: 'queue' },
    { text: 'Active Jobs', icon: <Work />, path: 'active' },
    { text: 'Print Labels', icon: <Print />, path: 'labels' },
    { text: 'Shipping Prep', icon: <LocalShipping />, path: 'shipping' },
    { text: 'My Stats', icon: <TrendingUp />, path: 'stats' }
  ]
};

// App branding by role
const brandingByRole = {
  admin: {
    title: 'Cheese ERP',
    subtitle: 'Admin Portal',
    color: '#1976d2',
    bgColor: '#e3f2fd'
  },
  factory: {
    title: 'Cheese ERP',
    subtitle: 'Production',
    color: '#2e7d32',
    bgColor: '#e8f5e8'
  },
  packaging: {
    title: 'Cheese ERP',
    subtitle: 'Packaging',
    color: '#9c27b0',
    bgColor: '#f3e5f5'
  }
};

function Sidebar({ 
  currentPage, 
  onPageChange, 
  mobileOpen, 
  onDrawerToggle, 
  drawerWidth, 
  isMobile,
  userRole = 'admin'
}) {
  
  const menuItems = menuItemsByRole[userRole] || menuItemsByRole.admin;
  const branding = brandingByRole[userRole] || brandingByRole.admin;

  // Get status indicator for some menu items
  const getStatusChip = (path) => {
    // Show status chips for certain items based on role
    if (userRole === 'admin') {
      if (path === 'users') {
        return <Chip label="8" size="small" color="primary" />;
      }
      if (path === 'batches') {
        return <Chip label="12" size="small" color="success" />;
      }
    }
    
    if (userRole === 'factory') {
      if (path === 'my-batches') {
        return <Chip label="3" size="small" color="warning" />;
      }
    }
    
    if (userRole === 'packaging') {
      if (path === 'queue') {
        return <Chip label="8" size="small" color="error" />;
      }
    }
    
    return null;
  };

  // Drawer content that will be used in both mobile and desktop versions
  const drawer = (
    <Box>
      {/* App logo and title */}
      <Toolbar sx={{ 
        bgcolor: branding.bgColor,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <Avatar sx={{ 
            bgcolor: branding.color, 
            width: 40, 
            height: 0 
          }}>
            <LocalDining />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color={branding.color}>
              {branding.title}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {branding.subtitle}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />
      
      {/* Navigation menu */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isSelected = currentPage === item.path;
          const statusChip = getStatusChip(item.path);
          
          return (
            <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onPageChange(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: branding.color + '20',
                    color: branding.color,
                    '&:hover': {
                      backgroundColor: branding.color + '30',
                    },
                    '& .MuiListItemIcon-root': {
                      color: branding.color,
                    },
                  },
                  '&:hover': {
                    backgroundColor: branding.color + '10',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400
                  }}
                />
                {statusChip && (
                  <Box sx={{ ml: 1 }}>
                    {statusChip}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer - temporary overlay */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            position: 'relative'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer - permanent */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            position: 'relative'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;