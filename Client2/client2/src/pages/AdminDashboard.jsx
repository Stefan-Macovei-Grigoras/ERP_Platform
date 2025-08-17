import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery, CircularProgress } from '@mui/material';

// Shared components
import Header from '../components/shared/Header';
import Sidebar from '../components/shared/Sidebar';
import StatsCard from '../components/shared/StatsCard';
import BatchTable from '../components/shared/BatchTable';

// Admin-specific components
import UserManagement from '../components/admin/UserManagement';
import ProductCatalog from '../components/admin/ProductCatalog';
import InventoryOverview from '../components/admin/InventoryOverview';

// Packaging component
import PackagingDashboard from '../pages/PackagingDashboard';

// API service
import factoryApiService from '../services/factory/factoryApiService';

const drawerWidth = 280;

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeBatches: 0,
    totalProducts: 0,
    lowStockItems: 0,
    readyForPackaging: 0,
    loading: true,
    error: null
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsData(prev => ({ ...prev, loading: true, error: null }));
        
        // Fetch data from multiple endpoints
        const [batches, products, users] = await Promise.all([
          factoryApiService.makeRequest('/batch'),
          factoryApiService.makeRequest('/product'),
          factoryApiService.makeRequest('/user').catch(() => []) // Users endpoint might not exist
        ]);

        // Calculate statistics from the data
        const activeBatches = batches.filter(batch => 
          ['due', 'start-processing', 'end-processing'].includes(batch.stage)
        ).length;

        const readyForPackaging = batches.filter(batch => 
          batch.stage === 'end-processing'
        ).length;

        const inProgressBatches = batches.filter(batch => 
          batch.stage === 'start-processing'
        ).length;

        // Calculate low stock items (products with quantity <= 2)
        const lowStockItems = products.filter(product => 
          product.quantity <= 2
        ).length;

        // Get recent activity (batches updated in last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const recentBatches = batches.filter(batch => {
          const updatedAt = new Date(batch.updatedAt);
          return updatedAt > yesterday;
        }).length;

        setStatsData({
          totalUsers: users.length || 8, // Fallback to hardcoded if endpoint doesn't exist
          activeBatches: activeBatches,
          inProgressBatches: inProgressBatches,
          totalProducts: products.length,
          lowStockItems: lowStockItems,
          readyForPackaging: readyForPackaging,
          recentActivity: recentBatches,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Failed to fetch dashboard statistics:', error);
        setStatsData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load statistics'
        }));
      }
    };

    if (currentPage === 'overview') {
      fetchDashboardStats();
    }
  }, [currentPage]);

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    console.log('handlePageChange called with:', page);
    setCurrentPage(page);
    if (isMobile) setMobileOpen(false);
  };

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductCatalog />;
      case 'inventory':
        return <InventoryOverview />;
      case 'batches':
        return <BatchTable showAll={true} allowManagement={true} />;
      case 'packaging':
        return <PackagingDashboard />;
      case 'overview':
      default:
        return (
          <Box>
            {/* Stats Cards Row */}
            <Box display="flex" gap={3} mb={4} sx={{ 
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              '& > *': { minWidth: { xs: '100%', sm: '200px' } }
            }}>
              {statsData.loading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <Box key={index} sx={{ 
                    minWidth: { xs: '100%', sm: '200px' },
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 1
                  }}>
                    <CircularProgress size={24} />
                  </Box>
                ))
              ) : statsData.error ? (
                // Error state
                <Box sx={{ 
                  width: '100%',
                  p: 2,
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  borderRadius: 1,
                  textAlign: 'center'
                }}>
                  {statsData.error}
                </Box>
              ) : (
                // Real data
                <>
                  <StatsCard 
                    title="Total Users" 
                    value={statsData.totalUsers.toString()} 
                    color="#1976d2"
                    change={`${statsData.totalUsers > 0 ? 'Active' : 'No'} users`}
                  />
                  <StatsCard 
                    title="Active Batches" 
                    value={statsData.activeBatches.toString()} 
                    color="#2e7d32"
                    change={`${statsData.inProgressBatches} in progress`}
                  />
                  <StatsCard 
                    title="Products" 
                    value={statsData.totalProducts.toString()} 
                    color="#9c27b0"
                    change={`${statsData.totalProducts > 0 ? 'Available' : 'None'} in catalog`}
                  />
                  <StatsCard 
                    title="Low Stock Items" 
                    value={statsData.lowStockItems.toString()} 
                    color={statsData.lowStockItems > 0 ? "#ed6c02" : "#4caf50"}
                    change={statsData.lowStockItems > 0 ? "Requires attention" : "Stock levels OK"}
                  />
                  <StatsCard 
                    title="Ready for Packaging" 
                    value={statsData.readyForPackaging.toString()} 
                    color="#ff9800"
                    change={`${statsData.readyForPackaging > 0 ? 'Processing complete' : 'None ready'}`}
                  />
                </>
              )}
            </Box>

            {/* Main Dashboard Content */}
            <Box display="flex" gap={3} sx={{ 
              flexDirection: { xs: 'column', lg: 'row' }
            }}>
              {/* Recent Batches - Takes more space */}
              <Box sx={{ flex: { lg: 2 } }}>
                <BatchTable 
                  showAll={true} 
                  allowManagement={true}
                  maxRows={8}
                  title="Recent Batches"
                />
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header Component */}
      <Header 
        title="Admin Dashboard"
        currentPage={currentPage}
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        userRole="admin"
      />

      {/* Sidebar Component */}
      <Sidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        userRole="admin"
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Account for header height
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default AdminDashboard;