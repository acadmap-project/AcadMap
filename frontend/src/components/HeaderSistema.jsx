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
        <nav className="navbar bg-base-100 shadow-sm px-4 py-2">
          <div className="navbar-start">
            <Link
              to="/"
              className="text-xl font-bold text-primary"
              aria-current="page"
            >
              AcadMap
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-center hidden lg:flex">
            <div className="flex items-center space-x-4">
              {(effectiveUserType === 'AUDITOR' ||
                effectiveUserType === 'PESQUISADOR' ||
                effectiveUserType === 'ADMINISTRADOR') && (
                <EventPeriodDropdown />
              )}
              <Link
                to="/cadastro-usuario"
                className="block py-2 px-3 btn btn-soft btn-primary"
                aria-current="page"
              >
                Cadastrar Usuário
              </Link>
              {(effectiveUserType === 'AUDITOR' ||
                effectiveUserType === 'ADMINISTRADOR') && (
                <Link
                  to="/registros-pendentes"
                  className="block py-2 px-3 btn btn-soft btn-primary"
                  aria-current="page"
                >
                  Registros Pendentes
                </Link>
              )}
              {userType === 'ADMINISTRADOR' && (
                <Link
                  to="/auditoria-logs"
                  className="block py-2 px-3 btn btn-soft btn-primary"
                  aria-current="page"
                >
                  Auditoria do Sistema
                </Link>
              )}
            </div>
          </div>

          <div className="navbar-end">
            {/* User Info - Desktop */}
            {isLoggedIn && (
              <div className="hidden sm:flex items-center space-x-3 mr-3">
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral text-neutral-content w-8 rounded-full">
                    <span className="text-xs">
                      {effectiveUserName[0] + effectiveUserName[1]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm">{effectiveUserName}</span>
                  <span className="text-xs">{effectiveUserType}</span>
                </div>
              </div>
            )}

            {/* Login/Logout Button */}
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
              <Link to="/login" aria-current="page" className="btn btn-primary">
                Logar
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="dropdown dropdown-end lg:hidden ml-2">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64"
              >
                {isLoggedIn && (
                  <li className="sm:hidden mb-2">
                    <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg pointer-events-none">
                      <div className="avatar avatar-placeholder">
                        <div className="bg-primary text-primary-content w-8 rounded-full">
                          <span className="text-xs font-medium">
                            {effectiveUserName[0] + effectiveUserName[1]}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {effectiveUserName}
                        </span>
                        <span className="text-xs opacity-70">
                          {effectiveUserType}
                        </span>
                      </div>
                    </div>
                  </li>
                )}
                {(effectiveUserType === 'AUDITOR' ||
                  effectiveUserType === 'PESQUISADOR' ||
                  effectiveUserType === 'ADMINISTRADOR') && (
                  <>
                    <li className="menu-title">
                      <span>Cadastrar</span>
                    </li>
                    <li>
                      <Link to="/cadastro-evento">Cadastrar Eventos</Link>
                    </li>
                    <li>
                      <Link to="/cadastro-periodico">Cadastrar Periódicos</Link>
                    </li>
                    <div className="divider my-1"></div>
                  </>
                )}
                <li>
                  <Link to="/cadastro-usuario">Cadastrar Usuário</Link>
                </li>
                {(effectiveUserType === 'AUDITOR' ||
                  effectiveUserType === 'ADMINISTRADOR') && (
                  <li>
                    <Link to="/registros-pendentes">Registros Pendentes</Link>
                  </li>
                )}
                {userType === 'ADMINISTRADOR' && (
                  <li>
                    <Link to="/auditoria-logs">Auditoria do Sistema</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
export default HeaderSistema;
