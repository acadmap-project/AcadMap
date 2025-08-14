import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Label } from 'recharts';

const COLORS = [
  '#F9B673', // laranja
  '#53C3C3', // azul
];

const ADEQUACAO_LABELS = {
  'mestrado': 'Apenas Mestrado',
  'doutorado': 'Apenas Doutorado',
  'mestrado_doutorado': 'Mestrado e Doutorado',
  'nenhuma': 'Nenhuma'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-100 p-2 rounded">
        <p>Categoria: {payload[0].payload.adequacao}</p>
        <div className='flex items-center gap-2'>
          <span className='inline-block w-3 h-3 rounded' style={{ backgroundColor: COLORS[0] }}></span>
          Sim: {payload[0].payload['Com Vínculo SBC']}
        </div>
        <div className='flex items-center gap-2'>
          <span className='inline-block w-3 h-3 rounded' style={{ backgroundColor: COLORS[1] }}></span>
          Não: {payload[0].payload['Sem Vínculo SBC']}
        </div>
      </div>
    );
  }
  return null;
};

const getAdequacaoLabel = (adequacao) => {
  if (!adequacao || adequacao.length === 0) return ADEQUACAO_LABELS['nenhuma'];
  if (adequacao.includes('mestrado_doutorado')) return ADEQUACAO_LABELS['mestrado_doutorado'];
  if (adequacao.includes('mestrado') && adequacao.length === 1) return ADEQUACAO_LABELS['mestrado'];
  if (adequacao.includes('doutorado') && adequacao.length === 1) return ADEQUACAO_LABELS['doutorado'];
  return adequacao.join(', ');
};

const GraficoAdequacaoDefesa = ({ data }) => {
  // Agrupa por adequação e vínculo SBC
  const contagem = {};

  [...data.eventos, ...data.periodicos].forEach(item => {
    const adequacao = Array.isArray(item.adequacaoDefesa)
      ? item.adequacaoDefesa.map(a => a.toLowerCase())
      : typeof item.adequacaoDefesa === 'string'
        ? [item.adequacaoDefesa.toLowerCase()]
        : [];

    const label = getAdequacaoLabel(adequacao);
    const vinculo = item.vinculoSBC ? 'Com Vínculo SBC' : 'Sem Vínculo SBC';

    if (!contagem[label]) {
      contagem[label] = {
        adequacao: label,
        'Com Vínculo SBC': 0,
        'Sem Vínculo SBC': 0
      };
    }
    contagem[label][vinculo]++;
  });

  const chartData = Object.values(contagem);

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">Veículos por Adequação para Defesa</h3>
      <BarChart
        layout="vertical"
        width={600}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false}>
          <Label value="Número de veículos" position="insideBottom" offset={-10} />
        </XAxis>
        <YAxis type="category" dataKey="adequacao" width={180}>
          <Label
            value="Adequação para defesa"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
            offset={-30}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} position={{ x: 50, y: 400 }} animationDuration={0} />
        <Legend verticalAlign="top" />
        <Bar dataKey="Com Vínculo SBC" fill={COLORS[0]} name="Com Vínculo SBC" />
        <Bar dataKey="Sem Vínculo SBC" fill={COLORS[1]} name="Sem Vínculo SBC" />
      </BarChart>
    </div>
  );
};

export default GraficoAdequacaoDefesa;