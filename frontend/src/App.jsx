import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
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
import VisualizarGraficos from './pages/VisualizarGraficos';
import VisualizarHistorico from './pages/VisualizarHistorico';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Carregando...</div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App w-screen h-screen">
          <main>
            <Suspense fallback={<LoadingComponent />}>
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
                <Route
                  path="/cadastro-pendente"
                  element={<GerenciadorCadastros />}
                />
                <Route
                  path="/visualizar-graficos"
                  element={<VisualizarGraficos />}
                />
                <Route path="/pendente/:id" element={<DetalhePendente />} />
                <Route
                  path="/periodico/:id"
                  element={<VisualizarPeriodico />}
                />
                <Route path="/evento/:id" element={<VisualizarEvento />} />
                <Route
                  path="/historico-auditoria"
                  element={<VisualizarHistorico />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
