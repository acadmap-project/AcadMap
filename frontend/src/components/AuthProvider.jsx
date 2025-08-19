import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/userAuth';

/**
 * Component that handles authentication state and redirects
 * Wrap your app or protected routes with this component
 */
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { loggedIn, logout } = useLogin();

  useEffect(() => {
    // Listen for authentication errors
    const handleAuthError = event => {
      console.log('Authentication error detected:', event.detail);

      // Force logout and redirect to login
      logout();
      navigate('/login', { replace: true });
    };

    // Listen for successful login state changes
    const handleLoginStateChange = () => {
      // Sync authentication state across tabs
      const savedLogin = localStorage.getItem('login');
      if (!savedLogin || savedLogin === 'undefined' || savedLogin === 'null') {
        // User logged out in another tab
        logout();
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('authError', handleAuthError);
    window.addEventListener('loginStateChange', handleLoginStateChange);

    return () => {
      window.removeEventListener('authError', handleAuthError);
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, [logout, navigate]);

  return <>{children}</>;
};

export default AuthProvider;
