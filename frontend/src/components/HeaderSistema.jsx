import { Link } from 'react-router-dom';
import pfpImage from '../assets/pfp.svg';
import EventPeriodDropdown from './EventPeriodDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import useLogin from '../hooks/userAuth.js';

function HeaderSistema({ userType, userName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn, logout } = useLogin();

  // Determine effective user info, prioritizing current auth state
  const effectiveUserName =
    loggedIn?.userName ?? userName ?? 'Usuário Desconhecido';
  const effectiveUserType = loggedIn?.userType ?? userType ?? 'Visitante';
  const isLoggedIn = !!loggedIn?.isLoggedIn;

  // Handle logout with redirect to home
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header>
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-primary"
              aria-current="page"
            >
              AcadMap
            </Link>
          </div>

          <div className="flex items-center">
            <ul
              className="flex flex-row space-x-4 items-center"
            >
              {(effectiveUserType === 'AUDITOR' ||
                effectiveUserType === 'PESQUISADOR' ||
                effectiveUserType === 'ADMINISTRADOR') && (
                <li>
                  <EventPeriodDropdown />
                </li>
              )}
              {(effectiveUserType === 'AUDITOR' ||
                effectiveUserType === 'ADMINISTRADOR') && (
                <li>
                  <Link
                    to="/registros-pendentes"
                    className="block py-2 px-3 btn btn-outline"
                    aria-current="page"
                  >
                    Registros Pendentes
                  </Link>
                </li>
              )}
              {userType === 'ADMINISTRADOR' && (
                <li>
                  <Link
                    to="/auditoria-logs"
                    className="block py-2 px-3 btn btn-outline"
                    aria-current="page"
                  >
                    Auditoria do Sistema
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/cadastro-usuario"
                  className="block py-2 px-3 btn btn-outline"
                  aria-current="page"
                >
                  Cadastrar Usuário
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: User Info and Login/Logout */}
          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <div className="flex items-center space-x-3">
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral text-neutral-content w-8 rounded-full">
                    <span className="text-xs">{effectiveUserName[0]+effectiveUserName[1]}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm">
                    {effectiveUserName} 
                  </span>
                  <span className="text-xs">
                    {effectiveUserType}
                  </span>
                </div>
              </div>
            )}
            
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                aria-current="page"
                className="btn btn-primary"
              >
                Deslogar
              </button>
            ) : (
              <Link
                to="/login"
                aria-current="page"
                className="btn btn-primary"
              >
                Logar
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
export default HeaderSistema;
