// src/components/ProtectedRoute/ProtectedRoute.jsx

import { useContext } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to='/sign-in' />;
  }

  return children;
};

export default ProtectedRoute;