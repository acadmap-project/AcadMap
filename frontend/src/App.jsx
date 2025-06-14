import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroEvento from './pages/CadastroEvento';
import RegistrosPendentes from './pages/RegistrosPendentes';
import RevisaoCadastroEvento from './pages/RevisaoCadastroEvento';
import CadastroPeriodico from './pages/CadastroPeriodico';

const App = () => {
  return (
    <Router>
      <div className="App w-screen h-screen">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-evento" element={<CadastroEvento />} />
            <Route path="/cadastro-periodico" element={<CadastroPeriodico />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route
              path="/registros-pendentes"
              element={<RegistrosPendentes />}
            />
            <Route
              path="/revisao-cadastro-evento"
              element={<RevisaoCadastroEvento />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
