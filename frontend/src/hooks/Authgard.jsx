// src/components/AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Or use Context/Redux

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;