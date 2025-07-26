import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
          ERP Dashboard
        </Typography>

        {user && (
          <Box>
            <Button color="inherit" component={Link} to="/products">Products</Button>
            <Button color="inherit" component={Link} to="/raw-materials">Raw Materials</Button>
            <Button color="inherit" component={Link} to="/orders">Orders</Button>
            <Button color="inherit" component={Link} to="/recipes">Recipes</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
