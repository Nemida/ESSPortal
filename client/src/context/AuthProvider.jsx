import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        api.defaults.headers.common['x-auth-token'] = storedToken;
        try {
          const res = await api.get('/api/auth');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          api.defaults.headers.common['x-auth-token'] = null;
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['x-auth-token'] = token;
    setUser(user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['x-auth-token'] = null;
    setUser(null);
    navigate('/login');
  };

  const authContextValue = {
    user,
    setUser, 
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};