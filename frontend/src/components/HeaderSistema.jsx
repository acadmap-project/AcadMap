import { Outlet, Link } from 'react-router-dom';

function HeaderSistema({ userType, userName }) {
  return (
    <>      <header>
        <nav className="bg-gray-800 border-gray-700 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center space-x-3">
              <img
                className="w-10 h-10 rounded-full"
                src="src/assets/pfp.svg"
                alt="Rounded avatar"
              ></img>              <span className="text-white font-medium text-sm">
                {userName || 'Usuário Desconhecido'} -{' '}
                {userType || 'NÃO LOGADO'}
              </span>
            </div>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-600 rounded-none bg-gray-700 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-800 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                {(userType === 'AUDITOR' || userType === 'PESQUISADOR') && (
                  <li>                    <Link
                      to={'/cadastro-evento'}
                      className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0"
                      aria-current="page"
                    >
                      Cadastrar Evento
                    </Link>
                  </li>
                )}
                {(userType === 'AUDITOR' || userType === 'PESQUISADOR') && (
                  <li>
                    <Link
                      to={'/cadastro-periodico'}
                      className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0"
                      aria-current="page"
                    >
                      Cadastrar Periódico
                    </Link>
                  </li>
                )}
                {userType === 'AUDITOR' && (
                  <li>                    <Link
                      to={'/registros-pendentes'}
                      className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0"
                      aria-current="page"
                    >
                      Registros Pendentes
                    </Link>
                  </li>
                )}
                <li>                  <Link
                    to={'/cadastro-usuario'}
                    className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0"
                    aria-current="page"
                  >
                    Cadastrar Usuário
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
export default HeaderSistema;
