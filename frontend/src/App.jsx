import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroEP from './pages/CadastroEventoPeriodico';

const App = () => {
  return (
    <Router>
      <div className="App">
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-evento-periodico" element={<CadastroEP />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;