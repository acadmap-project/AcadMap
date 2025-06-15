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

  useEffect(() => {
    localStorage.setItem('login', JSON.stringify(loggedIn));
  }, [loggedIn]);

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

    setLoggedState({
      isLoggedIn: true,
      userType: userType,
      userName: userData.userName || userName,
      id: userId,
      ...userData,
    });
  };

  const logout = () => {
    setLoggedState({
      isLoggedIn: false,
      userType: null,
      userName: null,
      id: null,
    });
    localStorage.removeItem('login');
  };

  return { loggedIn, login, logout };
}

export default useLogin;
