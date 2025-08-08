import { useState, useEffect } from 'react';

function useLogin() {
  const [loggedIn, setLoggedState] = useState(() => {
    try {
      const saved = localStorage.getItem('login');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsedData = JSON.parse(saved);

        // If no ID exists, set it based on userType for backward compatibility
        if (parsedData.isLoggedIn && !parsedData.id && parsedData.userType) {
          let userId, userName;
          switch (parsedData.userType) {
            case 'PESQUISADOR':
              userId = '11111111-1111-1111-1111-111111111111';
              userName = 'Dra. Ada Lovelace';
              break;
            case 'ADMINISTRADOR':
              userId = '00000000-0000-0000-0000-000000000001';
              userName = 'Admin Mestre';
              break;
            case 'AUDITOR':
              userId = '33333333-3333-3333-3333-333333333333';
              userName = 'Grace Hopper';
              break;
            default:
              userId = '0';
              userName = 'Usuário Desconhecido';
          }
          parsedData.id = userId;
          if (!parsedData.userName) {
            parsedData.userName = userName;
          }
        }

        return parsedData;
      }
      return { isLoggedIn: false, userType: null, userName: null, id: null };
    } catch (error) {
      console.error('Error parsing login data from localStorage:', error);
      localStorage.removeItem('login');
      return { isLoggedIn: false, userType: null, userName: null, id: null };
    }
  });

  // Persist to localStorage; when logged out, clear it
  useEffect(() => {
    try {
      if (loggedIn?.isLoggedIn) {
        localStorage.setItem('login', JSON.stringify(loggedIn));
      } else {
        localStorage.removeItem('login');
      }
    } catch (error) {
      console.error('Error writing login data to localStorage:', error);
    }
  }, [loggedIn]);

  // Sync state across multiple hook instances via custom and storage events
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('login');
        if (saved && saved !== 'undefined' && saved !== 'null') {
          const parsed = JSON.parse(saved);
          setLoggedState(prev => {
            // Avoid unnecessary updates
            if (JSON.stringify(prev) === JSON.stringify(parsed)) return prev;
            return parsed;
          });
        } else {
          setLoggedState(prev => {
            if (
              prev.isLoggedIn === false &&
              !prev.userType &&
              !prev.userName &&
              !prev.id
            )
              return prev;
            return {
              isLoggedIn: false,
              userType: null,
              userName: null,
              id: null,
            };
          });
        }
      } catch (e) {
        console.error('Error syncing login state:', e);
      }
    };

    const onStorage = e => {
      if (e.key === 'login') handleSync();
    };

    window.addEventListener('loginStateChange', handleSync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('loginStateChange', handleSync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const broadcastChange = () => {
    try {
      window.dispatchEvent(new Event('loginStateChange'));
    } catch {
      // no-op
    }
  };

  const login = (userData = {}) => {
    const userType = userData.userType || 'PESQUISADOR';

    // Set user ID and name based on user type
    let userId, userName;
    switch (userType) {
      case 'PESQUISADOR':
        userId = '11111111-1111-1111-1111-111111111111';
        userName = 'Dra. Ada Lovelace';
        break;
      case 'ADMINISTRADOR':
        userId = '00000000-0000-0000-0000-000000000001';
        userName = 'Admin Mestre';
        break;
      case 'AUDITOR':
        userId = '33333333-3333-3333-3333-333333333333';
        userName = 'Grace Hopper';
        break;
      default:
        userId = '000';
        userName = 'Usuário Desconhecido';
    }

    const nextState = {
      isLoggedIn: true,
      userType: userType,
      userName: userData.userName || userName,
      id: userId,
      ...userData,
    };
    setLoggedState(nextState);
    try {
      localStorage.setItem('login', JSON.stringify(nextState));
    } catch {
      // no-op
    }
    broadcastChange();
  };

  const logout = () => {
    const nextState = {
      isLoggedIn: false,
      userType: null,
      userName: null,
      id: null,
    };
    setLoggedState(nextState);
    try {
      localStorage.removeItem('login');
    } catch {
      // no-op
    }
    broadcastChange();
  };

  return { loggedIn, login, logout };
}

export default useLogin;
