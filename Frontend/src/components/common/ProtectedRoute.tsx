import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/auth';

interface Props {
  children: React.ReactElement;
}

/**
 * ProtectedRoute
 * Cek apakah user punya token JWT yang valid (belum expired).
 * Kalau tidak valid, redirect ke /login.
 */
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
