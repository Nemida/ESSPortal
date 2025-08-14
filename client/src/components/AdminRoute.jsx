import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
  
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;