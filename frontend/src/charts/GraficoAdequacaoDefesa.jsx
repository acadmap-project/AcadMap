import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Label,
} from 'recharts';
import { formatVinculoSBC, formatAdequacaoDefesa } from '../utils/format';

const COLORS = [
  '#F9B673', // laranja
  '#53C3C3', // azul
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-100 p-2 rounded">
        <p>Categoria: {payload[0].payload.adequacao}</p>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: COLORS[0] }}
          ></span>
          Com Vínculo SBC: {payload[0].payload['Com Vínculo SBC']}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: COLORS[1] }}
          ></span>
          Sem Vínculo SBC: {payload[0].payload['Sem Vínculo SBC']}
        </div>
      </div>
    );
  }
  return null;
};

const GraficoAdequacaoDefesa = ({ data }) => {
  // Agrupa por adequação e vínculo SBC
  const contagem = {};

  [...data.eventos, ...data.periodicos].forEach(item => {
    // Formatar adequação para defesa
    const adequacaoFormatada = formatAdequacaoDefesa(item.adequacaoDefesa);
    
    // Determinar se tem vínculo SBC (qualquer tipo exceto 'sem_vinculo')
    const temVinculoSBC = item.vinculoSBC && item.vinculoSBC !== 'sem_vinculo';
    const vinculo = temVinculoSBC ? 'Com Vínculo SBC' : 'Sem Vínculo SBC';

    if (!contagem[adequacaoFormatada]) {
      contagem[adequacaoFormatada] = {
        adequacao: adequacaoFormatada,
        'Com Vínculo SBC': 0,
        'Sem Vínculo SBC': 0,
      };
    }
    contagem[adequacaoFormatada][vinculo]++;
  });

  const chartData = Object.values(contagem);

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">
        Veículos por Adequação para Defesa
      </h3>
      <BarChart
        layout="vertical"
        width={600}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false}>
          <Label
            value="Número de veículos"
            position="insideBottom"
            offset={-10}
          />
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
        <Tooltip
          content={<CustomTooltip />}
          animationDuration={0}
          position={{ x: 20, y: 380 }}
        />
        <Legend verticalAlign="top" />
        <Bar
          dataKey="Com Vínculo SBC"
          fill={COLORS[0]}
          name="Com Vínculo SBC"
          stackId="a"
        />
        <Bar
          dataKey="Sem Vínculo SBC"
          fill={COLORS[1]}
          name="Sem Vínculo SBC"
          stackId="a"
        />
      </BarChart>
    </div>
  );
};

export default GraficoAdequacaoDefesa;
