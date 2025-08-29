import HeaderSistema from '../components/HeaderSistema';
import useLogin from '../hooks/userAuth.js';

const Home = () => {
  const { loggedIn, login, logout } = useLogin();
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSistema
        userType={loggedIn.userType}
        userName={loggedIn.userName}
      />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AcadMap</h1>
          <p className="text-lg max-w-md">
            Bem vindo a Home page, é necessário definir o que inserir aqui.
          </p>
        </div>

        <div className="p-8 rounded-none shadow-lg max-w-md w-full">
          {loggedIn.isLoggedIn ? (
            <div className="text-center space-y-4">
              <p className="text-lg">
                <span className="font-medium">Logado como:</span>{' '}
                <span className="font-semibold">
                  {loggedIn.userType || 'PESQUISADOR'}
                </span>
              </p>{' '}
              <button
                type="button"
                onClick={logout}
                className="w-full !bg-red-500 hover:!bg-red-600 font-medium py-3 px-6 rounded-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Deslogar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center mb-6">
                Selecione seu tipo de acesso
              </h2>{' '}
              <button
                type="button"
                onClick={() => login({ userType: 'PESQUISADOR' })}
                className="w-full !bg-black hover:!bg-gray-800 font-medium py-3 px-6 rounded-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              >
                Logar como Pesquisador
              </button>
              <button
                type="button"
                onClick={() => login({ userType: 'AUDITOR' })}
                className="w-full !bg-green-500 hover:!bg-green-600 font-medium py-3 px-6 rounded-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Logar como Auditor
              </button>
              <button
                type="button"
                onClick={() => login({ userType: 'ADMINISTRADOR' })}
                className="w-full !bg-blue-500 hover:!bg-blue-600 font-medium py-3 px-6 rounded-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Logar como Administrador
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
