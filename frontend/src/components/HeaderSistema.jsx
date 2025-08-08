import { Outlet, Link } from 'react-router-dom';
import pfpImage from '../assets/pfp.svg';
import EventPeriodDropdown from './EventPeriodDropdown';
import { useLocation } from 'react-router-dom';
import useLogin from '../hooks/userAuth.js';

function HeaderSistema({ userType, userName }) {
  const location = useLocation();
  const { loggedIn, logout } = useLogin();

  // Determine effective user info, prioritizing current auth state
  const effectiveUserName =
    loggedIn?.userName ?? userName ?? 'Usuário Desconhecido';
  const effectiveUserType = loggedIn?.userType ?? userType ?? 'NÃO LOGADO';
  const isLoggedIn = !!loggedIn?.isLoggedIn;

  return (
    <>
      <header>
        <nav className="flex items-center justify-between bg-white border-2 border-black dark:bg-white px-4 py-2">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3"
              aria-current="page"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={pfpImage}
                alt="Rounded avatar"
              />
              <span
                className="text-black text-sm"
                style={{ fontFamily: 'Poppins', fontWeight: '300' }}
              >
                {effectiveUserName} - {effectiveUserType}
              </span>
            </Link>

            <ul
              className="flex flex-row space-x-4 items-center ml-6"
              style={{ fontFamily: 'Poppins', fontWeight: '300' }}
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
                    className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                    aria-current="page"
                  >
                    Registros Pendentes
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/cadastro-usuario"
                  className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                  aria-current="page"
                >
                  Cadastrar Usuário
                </Link>
              </li>
              {location.pathname !== '/' && (
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                    aria-current="page"
                  >
                    Consultar Eventos e Periódicos
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={logout}
              aria-current="page"
              className="!px-4 !py-2 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50"
            >
              Deslogar
            </button>
          ) : (
            <Link
              to="/home"
              aria-current="page"
              className="!px-4 !py-2 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50"
            >
              Logar
            </Link>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
}
export default HeaderSistema;
