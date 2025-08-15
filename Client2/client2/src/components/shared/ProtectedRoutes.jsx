// // contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in on app start
//   useEffect(() => {
//     const checkAuth = () => {
//       try {
//         const savedUser = localStorage.getItem('user');
//         if (savedUser) {
//           setUser(JSON.parse(savedUser));
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('user');
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       // Simulate API call
//       const mockUsers = [
//         { id: 1, email: 'admin@cheese.ro', password: 'admin123', role: 'admin', name: 'Admin User' },
//         { id: 2, email: 'maria@cheese.ro', password: 'maria123', role: 'factory', name: 'Maria Popescu' },
//         { id: 3, email: 'ion@cheese.ro', password: 'ion123', role: 'packaging', name: 'Ion Georgescu' }
//       ];

//       const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
//       if (foundUser) {
//         const userData = {
//           id: foundUser.id,
//           email: foundUser.email,
//           role: foundUser.role,
//           name: foundUser.name
//         };
        
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         return { success: true, user: userData };
//       } else {
//         return { success: false, error: 'Invalid credentials' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Login failed. Please try again.' };
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated: !!user
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // routes/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Box, CircularProgress, Typography } from '@mui/material';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, loading, isAuthenticated } = useAuth();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <Box 
//         display="flex" 
//         flexDirection="column"
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="100vh"
//         gap={2}
//       >
//         <CircularProgress size={60} />
//         <Typography variant="h6" color="textSecondary">
//           Loading...
//         </Typography>
//       </Box>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check role-based access
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

// // routes/RoleBasedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const RoleBasedRoute = ({ children, allowedRoles }) => {
//   const { user, isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on user role
//     switch (user.role) {
//       case 'admin':
//         return <Navigate to="/admin" replace />;
//       case 'factory':
//         return <Navigate to="/factory" replace />;
//       case 'packaging':
//         return <Navigate to="/packaging" replace />;
//       default:
//         return <Navigate to="/login" replace />;
//     }
//   }

//   return children;
// };

// export default RoleBasedRoute;

// // App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import ProtectedRoute from './routes/ProtectedRoute';
// import RoleBasedRoute from './routes/RoleBasedRoute';

// // Import your dashboard components
// import Login from './pages/Login';
// import AdminDashboard from './pages/AdminDashboard';
// import FactoryDashboard from './pages/FactoryDashboard';
// import PackagingDashboard from './pages/PackagingDashboard';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />
          
//           {/* Protected routes with role-based access */}
//           <Route 
//             path="/admin/*" 
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/factory/*" 
//             element={
//               <ProtectedRoute allowedRoles={['factory', 'admin']}>
//                 <FactoryDashboard />
//               </ProtectedRoute>
//             } 
//           />
          
//           <Route 
//             path="/packaging/*" 
//             element={
//               <ProtectedRoute allowedRoles={['packaging', 'admin']}>
//                 <PackagingDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Default route - redirect based on user role */}
//           <Route 
//             path="/" 
//             element={
//               <ProtectedRoute>
//                 <RoleRedirect />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* 404 route */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// // Component to redirect users to their appropriate dashboard
// const RoleRedirect = () => {
//   const { user } = useAuth();
  
//   switch (user?.role) {
//     case 'admin':
//       return <Navigate to="/admin" replace />;
//     case 'factory':
//       return <Navigate to="/factory" replace />;
//     case 'packaging':
//       return <Navigate to="/packaging" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// export default App;

// // pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate, Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   Avatar,
//   Container
// } from '@mui/material';
// import { LocalDining, Login as LoginIcon } from '@mui/icons-material';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // Redirect if already logged in
//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password);
    
//     if (result.success) {
//       // Redirect based on user role
//       switch (result.user.role) {
//         case 'admin':
//           navigate('/admin');
//           break;
//         case 'factory':
//           navigate('/factory');
//           break;
//         case 'packaging':
//           navigate('/packaging');
//           break;
//         default:
//           navigate('/');
//       }
//     } else {
//       setError(result.error);
//     }
    
//     setLoading(false);
//   };

//   return (
//     <Container component="main" maxWidth="sm">
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
//           {/* Logo and title */}
//           <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
//             <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
//               <LocalDining fontSize="large" />
//             </Avatar>
//             <Typography component="h1" variant="h4" fontWeight="bold">
//               Cheese ERP
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               Factory Management System
//             </Typography>
//           </Box>

//           {/* Error message */}
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {/* Login form */}
//           <Box component="form" onSubmit={handleSubmit}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//               startIcon={<LoginIcon />}
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </Button>
//           </Box>

//           {/* Demo credentials */}
//           <Box mt={3}>
//             <Typography variant="body2" color="textSecondary" align="center" mb={1}>
//               Demo Credentials:
//             </Typography>
//             <Typography variant="caption" display="block" align="center">
//               Admin: admin@cheese.ro / admin123
//             </Typography>
//             <Typography variant="caption" display="block" align="center">
//               Factory: maria@cheese.ro / maria123
//             </Typography>
//             <Typography variant="caption" display="block" align="center">
//               Packaging: ion@cheese.ro / ion123
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

// // pages/Unauthorized.jsx
// import React from 'react';
// import { Box, Typography, Button, Container } from '@mui/material';
// import { Lock } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const Unauthorized = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const handleGoBack = () => {
//     // Redirect to appropriate dashboard
//     switch (user?.role) {
//       case 'admin':
//         navigate('/admin');
//         break;
//       case 'factory':
//         navigate('/factory');
//         break;
//       case 'packaging':
//         navigate('/packaging');
//         break;
//       default:
//         navigate('/login');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           textAlign: 'center',
//         }}
//       >
//         <Lock sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Access Denied
//         </Typography>
//         <Typography variant="body1" color="textSecondary" mb={3}>
//           You don't have permission to access this page.
//         </Typography>
//         <Button variant="contained" onClick={handleGoBack}>
//           Go to Dashboard
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Unauthorized;