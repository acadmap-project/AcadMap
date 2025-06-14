import { Outlet, Link } from 'react-router-dom';

function HeaderSistema({ userType, userName }) {
  return (
    <>
      {' '}
      <header>
        <nav className="bg-white border-2 border-black dark:bg-white">
          {' '}
          <div className="flex items-center p-2">
            <Link
              to={'/'}
              className="flex items-center space-x-3 pl-4"
              aria-current="page"
            >
              <img
                className="w-10 h-10 rounded-full"
                src="src/assets/pfp.svg"
                alt="Rounded avatar"
              ></img>{' '}
              <span
                className="text-black text-sm"
                style={{ fontFamily: 'Poppins', fontWeight: '300' }}
              >
                {userName || 'Usuário Desconhecido'} -{' '}
                {userType || 'NÃO LOGADO'}
              </span>
            </Link>{' '}
            <div className="flex md:flex md:w-auto ml-6" id="navbar-default">
              {' '}
              <ul
                className="flex flex-row space-x-4 items-center"
                style={{ fontFamily: 'Poppins', fontWeight: '300' }}
              >
                {(userType === 'AUDITOR' ||
                  userType === 'PESQUISADOR' ||
                  userType === 'ADMINISTRADOR') && (
                  <li>
                    {' '}
                    <Link
                      to={'/cadastro-evento'}
                      className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                      aria-current="page"
                    >
                      Cadastrar Evento
                    </Link>
                  </li>
                )}
                {(userType === 'AUDITOR' ||
                  userType === 'PESQUISADOR' ||
                  userType === 'ADMINISTRADOR') && (
                  <li>
                    {' '}
                    <Link
                      to={'/cadastro-periodico'}
                      className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                      aria-current="page"
                    >
                      Cadastrar Periódico
                    </Link>
                  </li>
                )}
                {(userType === 'AUDITOR' || userType === 'ADMINISTRADOR') && (
                  <li>
                    {' '}
                    <Link
                      to={'/registros-pendentes'}
                      className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
                      aria-current="page"
                    >
                      Registros Pendentes
                    </Link>
                  </li>
                )}
                <li>
                  {' '}
                  <Link
                    to={'/cadastro-usuario'}
                    className="block py-2 px-3 text-black bg-white border border-black rounded-none hover:bg-gray-100 transition-colors"
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
