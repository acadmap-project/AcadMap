import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroEvento from './pages/CadastroEvento';
import ValidacaoPeriodico from './pages/ValidacaoPeriodico';
import GerenciadorCadastros from './pages/GerenciadorCadastros';
import RegistrosPendentes from './pages/RegistrosPendentes';
import RevisaoCadastroEvento from './pages/RevisaoCadastroEvento';
import CadastroPeriodico from './pages/CadastroPeriodico';
import DetalhePendente from './pages/DetalhePendente';
import ConsultaEventosPeriodicos from './pages/ConsultaEventosPeriodicos';
import VisualizarPeriodico from './pages/VisualizarPeriodico';
import VisualizarEvento from './pages/VisualizarEvento';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import VisualizarGraficos from './pages/VisualizarGraficos';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App w-screen h-screen">
          <main>
            <Routes>
              <Route path="/" element={<ConsultaEventosPeriodicos />} />
              <Route path="/home" element={<Home />} />
              <Route path="/cadastro-evento" element={<CadastroEvento />} />
              <Route
                path="/cadastro-periodico"
                element={<CadastroPeriodico />}
              />
              <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
              <Route
                path="/registros-pendentes"
                element={<RegistrosPendentes />}
              />
              <Route
                path="/revisao-cadastro-evento"
                element={<RevisaoCadastroEvento />}
              />
              <Route
                path="/validacao-cadastro"
                element={<ValidacaoPeriodico />}
              />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/cadastro-pendente"
                element={<GerenciadorCadastros />}
              />
              <Route
                path="/visualizar-graficos"
                element={<VisualizarGraficos />}
              />
              <Route path="/pendente/:id" element={<DetalhePendente />} />
              <Route path="/periodico/:id" element={<VisualizarPeriodico />} />
              <Route path="/evento/:id" element={<VisualizarEvento />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
