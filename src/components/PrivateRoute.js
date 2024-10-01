// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role, restricted }) => {
  const { currentUser, role: userRole, applicationStatus } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  if (restricted && userRole === 'doctor' && (applicationStatus === 'pending' || applicationStatus === 'rejected')) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
