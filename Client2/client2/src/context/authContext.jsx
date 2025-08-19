// context/authContext.js - Fixed version
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Set axios header first
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Verify token is still valid
          const response = await axios.get('http://localhost:5000/verify-token');
          
          if (response.data.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token invalid, clear storage
            clearSession();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          clearSession();
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/login', credentials);
      
      // Extract data from backend response
      const { token: newToken, user: userData } = response.data;
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Redirect based on user role
      redirectToRoleDashboard(userData.role);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Let the component handle the error
    }
  };

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  const redirectToRoleDashboard = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        navigate('/admin');
        break;
      case 'factory':
      case 'factory_worker':
        navigate('/factory');
        break;
      case 'packaging':
      case 'packaging_worker':
        navigate('/packaging');
        break;
      default:
        console.warn('Unknown role:', role);
        navigate('/login');
        break;
    }
  };

  const value = {
    token,
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
    userRole: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};