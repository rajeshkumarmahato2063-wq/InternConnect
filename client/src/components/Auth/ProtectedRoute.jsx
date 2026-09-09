import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If unauthenticated -> redirect to Role Selector / Login page
  if (!isAuthenticated) {
    return <Navigate to="/auth/select-role" state={{ from: location }} replace />;
  }

  // If role is specified and current role doesn't match -> redirect to user's dashboard
  if (allowedRole && role !== allowedRole) {
    if (role === 'company') {
      return <Navigate to="/company/dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
