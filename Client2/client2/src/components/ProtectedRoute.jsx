import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.roleName !== role) return <Navigate to="/unauthorized" />;

  return children;
}
