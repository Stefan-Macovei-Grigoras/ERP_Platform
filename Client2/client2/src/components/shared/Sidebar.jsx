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
  ]
};

// App branding by role
const brandingByRole = {
  admin: {
    title: 'Cheese ERP',
    subtitle: 'Admin Portal',
    color: '#1976d2',
    bgColor: '#e3f2fd'
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
          //const statusChip = getStatusChip(item.path);
          
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
      position="static"
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