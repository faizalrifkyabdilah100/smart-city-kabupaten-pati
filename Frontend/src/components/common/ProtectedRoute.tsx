import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return <Navigate to="/login" replace />;
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
