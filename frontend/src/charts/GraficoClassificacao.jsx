import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts';

const COLORS = {
  eventos: '#FF6384', // vermelho
  periodicos: '#36A2EB', // azul
};

const classificacaoOrder = [
  'A1',
  'A2',
  'A3',
  'A4',
  'B1',
  'B2',
  'B3',
  'B4',
  'C',
  'NC',
  'OUTROS',
  '',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const bar = payload[0];
    const { name, value, dataKey } = bar;
    const color = COLORS[dataKey];
    return (
      <div className="bg-cyan-100 p-2 rounded flex items-center gap-2">
        <span
          className="inline-block w-2 h-2"
          style={{ backgroundColor: color }}
        ></span>
        <div>
          <p className="m-0">
            {name}: {value}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const GraficoClassificacao = ({ data }) => {
  const classificacoes = {};

  data.eventos.forEach(ev => {
    const key = (ev.classificacao || '').toUpperCase();
    if (!classificacoes[key])
      classificacoes[key] = { classificacao: key, eventos: 0, periodicos: 0 };
    classificacoes[key].eventos += 1;
  });

  data.periodicos.forEach(pe => {
    const key = (pe.classificacao || '').toUpperCase();
    if (!classificacoes[key])
      classificacoes[key] = { classificacao: key, eventos: 0, periodicos: 0 };
    classificacoes[key].periodicos += 1;
  });

  // Ordena conforme a ordem definida, e depois por ordem alfabética para os não previstos
  const chartData = Object.values(classificacoes).sort((a, b) => {
    const idxA = classificacaoOrder.indexOf(a.classificacao);
    const idxB = classificacaoOrder.indexOf(b.classificacao);
    if (idxA === -1 && idxB === -1) {
      return a.classificacao.localeCompare(b.classificacao);
    }
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-2xl">Distribuição por Classificação</h3>
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
          <Label
            value="Número de veículos"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} shared={false} />
        <Legend verticalAlign="top" wrapperStyle={{ top: 0 }} />
        <Bar dataKey="eventos" fill={COLORS.eventos} name="Eventos" />
        <Bar dataKey="periodicos" fill={COLORS.periodicos} name="Periódicos" />
      </BarChart>
    </div>
  );
};

export default GraficoClassificacao;
