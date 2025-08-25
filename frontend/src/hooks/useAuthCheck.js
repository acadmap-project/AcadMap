import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from './userAuth';
import tokenManager from '../utils/tokenManager';
import Logger from '../utils/logger';

/**
 * Hook to handle automatic token validation and refresh on app startup
 * Should be used in your main App component
 */
function useAuthCheck() {
  const { loggedIn, logout } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Skip check if user is not logged in
      if (!loggedIn?.isLoggedIn || !loggedIn?.accessToken) {
        return;
      }

      try {
        // Check if token is expired or close to expiring
        if (tokenManager.isTokenExpired(loggedIn.accessToken)) {
          console.log('Token expired, attempting refresh...');

          // Try to refresh the token
          const newToken = await tokenManager.refreshToken();
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        Logger.logError(`Falha na renovação do token: ${error.message}`);

        // If refresh fails, logout user and redirect to login
        logout();
        navigate('/login', { replace: true });
      }
    };

    // Check auth status on mount
    checkAuthStatus();

    // Set up periodic token check (every 5 minutes)
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loggedIn?.isLoggedIn, loggedIn?.accessToken, logout, navigate]);

  // Listen for authentication errors from other parts of the app
  useEffect(() => {
    const handleAuthError = () => {
      logout();
      navigate('/login', { replace: true });
    };

    window.addEventListener('authError', handleAuthError);

    return () => {
      window.removeEventListener('authError', handleAuthError);
    };
  }, [logout, navigate]);

  return null; // This hook doesn't return any UI
}

export default useAuthCheck;
