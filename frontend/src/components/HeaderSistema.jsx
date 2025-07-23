import { Outlet, Link } from 'react-router-dom';
import pfpImage from '../assets/pfp.svg';
import EventPeriodDropdown from './EventPeriodDropdown';

function HeaderSistema({ userType, userName }) {
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
                style={{ fontFamily: "Poppins", fontWeight: "300" }}
              >
                {userName || "Usuário Desconhecido"} - {userType || "NÃO LOGADO"}
              </span>
            </Link>

            <ul
              className="flex flex-row space-x-4 items-center ml-6"
              style={{ fontFamily: "Poppins", fontWeight: "300" }}
            >
              {(userType === "AUDITOR" ||
                userType === "PESQUISADOR" ||
                userType === "ADMINISTRADOR") && (
                  <li>
                    <EventPeriodDropdown />
                  </li>
                )}
              {(userType === "AUDITOR" || userType === "ADMINISTRADOR") && (
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
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                  aria-current="page"
                >
                  Consultar Eventos e Periódicos
                </Link>
              </li>
            </ul>
          </div>
          <Link
            to="/home"
            aria-current="page"
            className="!px-4 !py-2 !bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50"
          >
            Login
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
export default HeaderSistema;
