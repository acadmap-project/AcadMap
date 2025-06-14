import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroEvento from './pages/CadastroEvento';
import ValidacaoCadastro from './components/ValidacaoCadastro';
import GerenciadorCadastros from './pages/GerenciadorCadastros';

const App = () => {
  return (
    <Router>
      <div className="App w-screen h-screen">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-evento" element={<CadastroEvento />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cadastro-pendente" element={<GerenciadorCadastros />} />
            <Route path="/pendente/:id" element={<ValidacaoCadastro />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
