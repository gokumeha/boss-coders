import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="route-loading">Loading your workspace...</div>;
  }

  if (!user) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/signin"
      />
    );
  }

  return children;
}

