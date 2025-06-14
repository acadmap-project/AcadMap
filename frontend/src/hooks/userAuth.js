import { useState, useEffect } from 'react';

function useLogin() {
  const [loggedIn, setLoggedState] = useState(() => {
    try {
      const saved = localStorage.getItem('login');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return JSON.parse(saved);
      }
      return { isLoggedIn: false, userType: null, userName: null };
    } catch (error) {
      console.error('Error parsing login data from localStorage:', error);
      localStorage.removeItem('login');
      return { isLoggedIn: false, userType: null, userName: null };
    }
  });

  useEffect(() => {
    localStorage.setItem('login', JSON.stringify(loggedIn));
  }, [loggedIn]);

  const login = (userData = {}) => {
    setLoggedState({
      isLoggedIn: true,
      userType: userData.userType || 'PESQUISADOR',
      userName: userData.userName || null,
      ...userData,
    });
  };

  const logout = () => {
    setLoggedState({ isLoggedIn: false, userType: null, userName: null });
    localStorage.removeItem('login');
  };

  return { loggedIn, login, logout };
}

export default useLogin;
