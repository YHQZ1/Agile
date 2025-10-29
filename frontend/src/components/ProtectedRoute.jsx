import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Check only sessionStorage, not localStorage
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const isTestStudentAuthenticated = localStorage.getItem('isTestStudentAuthenticated') === 'true';
  const userType = sessionStorage.getItem('userType') || (isTestStudentAuthenticated ? 'student' : null);

  if (!isAuthenticated && !isTestStudentAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to={`/${userType}/default`} replace />;
  }

  return children;
};

export default ProtectedRoute;