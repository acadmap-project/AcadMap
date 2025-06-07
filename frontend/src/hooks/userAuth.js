import { useState, useEffect } from 'react';

function useLogin() {
  const [loggedIn, setLoggedState] = useState(() => {
    try {
      const saved = localStorage.getItem('login');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return JSON.parse(saved);
      }
      return { isLoggedIn: false };
    } catch (error) {
      console.error('Error parsing login data from localStorage:', error);
      localStorage.removeItem('login');
      return { isLoggedIn: false };
    }
  });

  useEffect(() => {
    localStorage.setItem('login', JSON.stringify(loggedIn));
  }, [loggedIn]);

  const login = () => {
    setLoggedState({
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setLoggedState({ isLoggedIn: false });
    localStorage.removeItem('login');
  };

  return { loggedIn, login, logout };
}

export default useLogin;
