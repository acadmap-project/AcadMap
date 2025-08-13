import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

const GraficoClassificacao = ({ data }) => {
  const classificacoes = {};

  data.eventos.forEach(ev => {
    const key = ev.classificacao;
    if (!classificacoes[key]) classificacoes[key] = { classificacao: key, eventos: 0, periodicos: 0 };
    classificacoes[key].eventos += 1;
  });

  data.periodicos.forEach(pe => {
    const key = pe.classificacao;
    if (!classificacoes[key]) classificacoes[key] = { classificacao: key, eventos: 0, periodicos: 0 };
    classificacoes[key].periodicos += 1;
  });

  const chartData = Object.values(classificacoes);

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='font-bold text-2xl'>Distribuição por Classificação</h3>
      <BarChart
        width={600}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="classificacao">
          <Label value="Classificação" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis allowDecimals={false}>
          <Label value="Número de veículos" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ top: 0 }} />
        <Bar dataKey="eventos" fill="#8884d8" name="Eventos" />
        <Bar dataKey="periodicos" fill="#82ca9d" name="Periódicos" />
      </BarChart>
    </div>
  );
};

export default GraficoClassificacao;
