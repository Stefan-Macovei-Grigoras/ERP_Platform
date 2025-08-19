 
// import { useState } from 'react';
// import { 
//   TextField, 
//   Button, 
//   Box, 
//   Typography, 
//   Alert, 
//   Paper,
//   InputAdornment,
//   IconButton,
//   Fade,
//   CircularProgress
// } from '@mui/material';
// import { 
//   Visibility, 
//   VisibilityOff, 
//   Person, 
//   Lock,
//   Login as LoginIcon 
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useAuth } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       const res = await axios.post('http://localhost:5000/login', form);
//       login(res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Box 
//       sx={{ 
//         minHeight: '100vh',
//         width: '105%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         transform: 'translate(-10px, -10px)'
//       }}
//     >
//       <Fade in={true} timeout={800}>
//         <Paper 
//           elevation={20}
//           sx={{ 
//             p: 5,
//             width: '100%',
//             maxWidth: 450,
//             borderRadius: 3,
//             background: 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.2)'
//           }}
//         >
//           {/* Header Section */}
//           <Box sx={{ textAlign: 'center', mb: 4 }}>
//             <Box 
//               sx={{ 
//                 width: 80,
//                 height: 80,
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 20px',
//                 boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
//               }}
//             >
//               <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
//             </Box>
            
//             <Typography 
//               variant="h4" 
//               sx={{ 
//                 fontWeight: 700,
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 mb: 1
//               }}
//             >
//               Welcome Back
//             </Typography>
            
//             <Typography 
//               variant="body1" 
//               sx={{ 
//                 color: 'text.secondary',
//                 fontWeight: 400
//               }}
//             >
//               Sign in
//             </Typography>
//           </Box>

//           {/* Error Alert */}
//           {error && (
//             <Fade in={true}>
//               <Alert 
//                 severity="error" 
//                 sx={{ 
//                   mb: 3,
//                   borderRadius: 2,
//                   '& .MuiAlert-icon': {
//                     alignItems: 'center'
//                   }
//                 }}
//               >
//                 {error}
//               </Alert>
//             </Fade>
//           )}

//           {/* Login Form */}
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Username"
//               name="username"
//               fullWidth
//               margin="normal"
//               value={form.username}
//               onChange={handleChange}
//               disabled={loading}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Person sx={{ color: 'action.active' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 mb: 2,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                   },
//                   '&.Mui-focused': {
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
//                   }
//                 }
//               }}
//             />

//             <TextField
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               fullWidth
//               margin="normal"
//               value={form.password}
//               onChange={handleChange}
//               disabled={loading}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock sx={{ color: 'action.active' }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={togglePasswordVisibility}
//                       edge="end"
//                       disabled={loading}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 mb: 3,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                   },
//                   '&.Mui-focused': {
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
//                   }
//                 }
//               }}
//             />

//             <Button 
//               type="submit" 
//               variant="contained" 
//               fullWidth 
//               disabled={loading || !form.username || !form.password}
//               sx={{ 
//                 mt: 2,
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontSize: '1.1rem',
//                 fontWeight: 600,
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
//                   boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
//                   transform: 'translateY(-2px)'
//                 },
//                 '&:disabled': {
//                   background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
//                   boxShadow: 'none',
//                   transform: 'none'
//                 }
//               }}
//             >
//               {loading ? (
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CircularProgress size={20} color="inherit" />
//                   <span>Signing In...</span>
//                 </Box>
//               ) : (
//                 'Sign In'
//               )}
//             </Button>
//           </form>
// {/* 
//           {/* Footer */}
//           {/* <Box sx={{ textAlign: 'center', mt: 3 }}>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: 'text.secondary',
//                 fontSize: '0.875rem'
//               }}
//             >
//               Secure access to your production system
//             </Typography>
//           </Box> */} 
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }

import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock,
  Login as LoginIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/authContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(form); // Use AuthContext login method
      // Navigation is handled by AuthContext based on user role
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '105%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        transform: 'translate(-10px, -10px)'
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={20}
          sx={{ 
            p: 5,
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              Sign in
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  }
                }
              }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  }
                }
              }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading || !form.username || !form.password}
              sx={{ 
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                  boxShadow: 'none',
                  transform: 'none'
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing In...</span>
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              Secure access to your production system
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}