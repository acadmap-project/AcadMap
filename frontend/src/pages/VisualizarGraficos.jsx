import { useLocation } from 'react-router-dom';
import GraficoClassificacao from '../charts/GraficoClassificacao';
import GraficoAreaConhecimento from '../charts/GraficoAreaConhecimento';
import GraficoAdequacaoDefesa from '../charts/GraficoAdequacaoDefesa';
import GraficoPredatorios from '../charts/GraficoPredatorios';
import { useNavigate } from 'react-router-dom';

const VisualizarGraficos = () => {
  const { state } = useLocation();
  const resultados = state?.resultados;

  const totalEventos = resultados.eventos.length;
  const totalPeriodicos = resultados.periodicos.length;
  const totalVeiculos = totalEventos + totalPeriodicos;
  const totalPredatorios = [
    ...resultados.eventos,
    ...resultados.periodicos,
  ].filter(item => item.predatorio).length;

  const navigate = useNavigate();

  const voltarParaConsultas = () => {
    // Salva os resultados atuais no sessionStorage para restaurar na página de consultas
    sessionStorage.setItem('consultaResultados', JSON.stringify(resultados));
    sessionStorage.setItem('consultaRestore', '1');
    navigate('/');
  };

  return (
    <>
      <h1 className="py-4 mb-8">DashBoard de Veículos Acadêmicos</h1>
      <div className="flex">
        <div className="flex flex-col shrink-0 px-4 gap-6 items-start mt-24">
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-lg">TOTAL DE VEÍCULOS</h2>
            <p className="text-xl">{totalVeiculos}</p>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-lg">PERIÓDICOS</h2>
            <p className="text-xl">{totalPeriodicos}</p>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-lg">EVENTOS</h2>
            <p className="text-xl">{totalEventos}</p>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-lg">PREDATÓRIOS</h2>
            <p className="text-xl">{totalPredatorios}</p>
          </div>
        </div>
        <div className="grow grid grid-cols-2 grid-rows-2 gap-y-6">
          <GraficoClassificacao data={resultados} />
          <GraficoAreaConhecimento data={resultados} />
          <GraficoAdequacaoDefesa data={resultados} />
          <GraficoPredatorios data={resultados} />
        </div>
      </div>
      <button
        onClick={voltarParaConsultas}
        className="!bg-black !text-white !border-0 !rounded-none hover:!bg-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-opacity-50 mt-8 !px-16 !py-6"
      >
        Voltar
      </button>
    </>
  );
};

export default VisualizarGraficos;
