import { Outlet, Link } from 'react-router-dom';

function HeaderSistema() {
  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <img
              className="w-10 h-10 rounded-full"
              src="/docs/images/people/profile-picture-5.jpg"
              alt="Rounded avatar"
            ></img>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to={'/cadastro-evento'}
                    className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                    aria-current="page"
                  >
                    Cadastrar Evento / Periódicos
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/#'}
                    className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                    aria-current="page"
                  >
                    Validação de Cadastros
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
