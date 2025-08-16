// import React, { useState } from 'react';
// import { Box, useTheme, useMediaQuery } from '@mui/material';

// // Shared components
// import Header from '../components/shared/Header';
// import Sidebar from '../components/shared/Sidebar';
// import StatsCard from '../components/shared/StatsCard';
// import BatchTable from '../components/shared/BatchTable';

// // Admin-specific components
// import UserManagement from '../components/admin/UserManagement';
// import ProductCatalog from '../components/admin/ProductCatalog';
// import InventoryOverview from '../components/admin/InventoryOverview';
// import AdminQuickActions from '../components/admin/AdminQuickActions';

// const drawerWidth = 280;

// function AdminDashboard() {
//   const [currentPage, setCurrentPage] = useState('overview');
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   // Handle mobile drawer toggle
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Handle page navigation
//   const handlePageChange = (page) => {
//     console.log('handlePageChange called with:', page); // Debug log
//     setCurrentPage(page);
//     if (isMobile) setMobileOpen(false);
//   };

//   // Debug log to verify function exists
//   console.log('handlePageChange function:', typeof handlePageChange);

//   // Render content based on current page
//   const renderContent = () => {
//     switch (currentPage) {
//       case 'users':
//         return <UserManagement />;
//       case 'products':
//         return <ProductCatalog />;
//       case 'inventory':
//         return <InventoryOverview />;
//       case 'batches':
//         return <BatchTable showAll={true} allowManagement={true} />;
//       case 'overview':
//       default:
//         return (
//           <Box>
//             {/* Stats Cards Row */}
//             <Box display="flex" gap={3} mb={4} sx={{ 
//               flexWrap: { xs: 'wrap', sm: 'nowrap' },
//               '& > *': { minWidth: { xs: '100%', sm: '200px' } }
//             }}>
//               <StatsCard 
//                 title="Total Users" 
//                 value="8" 
//                 color="#1976d2"
//                 change="2 online now"
//               />
//               <StatsCard 
//                 title="Active Batches" 
//                 value="12" 
//                 color="#2e7d32"
//                 change="+2 from yesterday"
//               />
//               <StatsCard 
//                 title="Products" 
//                 value="5" 
//                 color="#9c27b0"
//                 change="All in production"
//               />
//               <StatsCard 
//                 title="Low Stock Items" 
//                 value="3" 
//                 color="#ed6c02"
//                 change="Requires attention"
//               />
//             </Box>

//             {/* Main Dashboard Content */}
//             <Box display="flex" gap={3} sx={{ 
//               flexDirection: { xs: 'column', lg: 'row' }
//             }}>
//               {/* Recent Batches - Takes more space */}
//               <Box sx={{ flex: { lg: 2 } }}>
//                 <BatchTable 
//                   showAll={true} 
//                   allowManagement={true}
//                   maxRows={8}
//                   title="Recent Batches"
//                 />
//               </Box>

//               {/* Quick Actions Sidebar */}
//               <Box sx={{ flex: { lg: 1 } }}>
//                 <AdminQuickActions onPageChange={handlePageChange} />
//               </Box>
//             </Box>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {/* Header Component */}
//       <Header 
//         title="Admin Dashboard"
//         currentPage={currentPage}
//         drawerWidth={drawerWidth}
//         onDrawerToggle={handleDrawerToggle}
//         userRole="admin"
//       />

//       {/* Sidebar Component */}
//       <Sidebar 
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         mobileOpen={mobileOpen}
//         onDrawerToggle={handleDrawerToggle}
//         drawerWidth={drawerWidth}
//         isMobile={isMobile}
//         userRole="admin"
//       />

//       {/* Main Content Area */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           mt: 8, // Account for header height
//           minHeight: '100vh',
//           backgroundColor: '#f5f5f5'
//         }}
//       >
//         {renderContent()}
//       </Box>
//     </Box>
//   );
// }

// export default AdminDashboard;

import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Shared components
import Header from '../components/shared/Header';
import Sidebar from '../components/shared/Sidebar';
import StatsCard from '../components/shared/StatsCard';
import BatchTable from '../components/shared/BatchTable';

// Admin-specific components
import UserManagement from '../components/admin/UserManagement';
import ProductCatalog from '../components/admin/ProductCatalog';
import InventoryOverview from '../components/admin/InventoryOverview';
import AdminQuickActions from '../components/admin/AdminQuickActions';

// Packaging component
import PackagingDashboard from '../pages/PackagingDashboard';

const drawerWidth = 280;

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    console.log('handlePageChange called with:', page); // Debug log
    setCurrentPage(page);
    if (isMobile) setMobileOpen(false);
  };

  // Debug log to verify function exists
  console.log('handlePageChange function:', typeof handlePageChange);

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
              <StatsCard 
                title="Total Users" 
                value="8" 
                color="#1976d2"
                change="2 online now"
              />
              <StatsCard 
                title="Active Batches" 
                value="12" 
                color="#2e7d32"
                change="+2 from yesterday"
              />
              <StatsCard 
                title="Products" 
                value="5" 
                color="#9c27b0"
                change="All in production"
              />
              <StatsCard 
                title="Low Stock Items" 
                value="3" 
                color="#ed6c02"
                change="Requires attention"
              />
              <StatsCard 
                title="Ready for Packaging" 
                value="4" 
                color="#ff9800"
                change="Processing complete"
              />
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

              {/* Quick Actions Sidebar */}
              <Box sx={{ flex: { lg: 1 } }}>
                <AdminQuickActions onPageChange={handlePageChange} />
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