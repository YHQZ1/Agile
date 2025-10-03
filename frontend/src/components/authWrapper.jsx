import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from './api/Auth';

const AuthWrapper = ({ children, requireAuth = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await verifyToken();

      // If route requires auth but user is NOT logged in → redirect to /auth
      if (requireAuth && !isAuthenticated) {
        navigate('/auth');
      }

      // If route is public (like /auth) but user IS logged in → redirect to dashboard
      if (!requireAuth && isAuthenticated) {
        navigate('/student-dashboard');
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, requireAuth]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loader while checking
  }

  return children;
};

export default AuthWrapper;