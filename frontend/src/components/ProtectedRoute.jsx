import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/userAuth';
import SemPermissao from './SemPermissao';
import HeaderSistema from './HeaderSistema';

/**
 * Component that protects routes requiring authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect to if not authenticated (default: "/login")
 * @param {boolean} props.requireAdmin - Whether admin privileges are required
 * @param {boolean} props.showUnauthorizedMessage - Whether to show unauthorized message instead of redirecting
 */
const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requireAdmin = false,
  showUnauthorizedMessage = true,
}) => {
  const { loggedIn } = useLogin();
  const navigate = useNavigate();

  const isLoggedIn = loggedIn?.isLoggedIn;
  const isAdmin = loggedIn?.userType === 'ADMINISTRADOR';

  useEffect(() => {
    // If not logged in and we should redirect instead of showing message
    if (!isLoggedIn && !showUnauthorizedMessage) {
      navigate(redirectTo, { replace: true });
    }

    // If admin is required but user is not admin and we should redirect
    if (isLoggedIn && requireAdmin && !isAdmin && !showUnauthorizedMessage) {
      navigate('/', { replace: true });
    }
  }, [
    isLoggedIn,
    isAdmin,
    requireAdmin,
    redirectTo,
    showUnauthorizedMessage,
    navigate,
  ]);

  // Check if user is not logged in
  if (!isLoggedIn) {
    if (showUnauthorizedMessage) {
      return (
        <>
          <HeaderSistema
            userType={loggedIn?.userType}
            userName={loggedIn?.userName}
          />
          <SemPermissao
            titulo="Acesso Restrito"
            mensagem="Você precisa estar logado para acessar esta página."
            paginaRedirecionamento={redirectTo}
            textoRedirecionamento="Ir para Login"
            icone="🔐"
          />
        </>
      );
    }
    return null; // Will redirect via useEffect
  }

  // Check if admin is required but user is not admin
  if (requireAdmin && !isAdmin) {
    if (showUnauthorizedMessage) {
      return (
        <>
          <HeaderSistema
            userType={loggedIn?.userType}
            userName={loggedIn?.userName}
          />
          <SemPermissao
            titulo="Acesso Negado"
            mensagem="Você precisa ter privilégios de administrador para acessar esta página."
            paginaRedirecionamento="/"
            textoRedirecionamento="Voltar ao Início"
            icone="👨‍💼"
          />
        </>
      );
    }
    return null; // Will redirect via useEffect
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;
