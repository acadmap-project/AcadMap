import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GraficoClassificacao from "../charts/GraficoClassificacao";

const VisualizarGraficos = () => {
  const { state } = useLocation();
  const resultados = state?.resultados;
  const filtros = state?.filtros;

  useEffect(() => {
    console.log('Resultados para gráficos:', resultados);
  }, [resultados]);

  return (
    <>
      <h1 className="py-4 mb-8">DashBoard de Veículos Acadêmicos</h1>
      <div className="flex">
        <div className="flex flex-col shrink-0 px-4 gap-6 items-start">
          <h2 className="font-bold text-lg">TOTAL DE VEÍCULOS</h2>
          <h2 className="font-bold text-lg">PERIÓDICOS</h2>
          <h2 className="font-bold text-lg">EVENTOS</h2>
          <h2 className="font-bold text-lg">PREDATÓRIOS</h2>
        </div>
        <div className="grow grid grid-cols-2 grid-rows-2">
          <div><GraficoClassificacao data={resultados} /></div>
        </div>
      </div>
    </>
  )
}

export default VisualizarGraficos;