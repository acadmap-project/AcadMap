import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Label } from 'recharts';

const getAdequacaoLabel = (adequacao) => {
  if (!adequacao || adequacao.length === 0) return 'Nenhuma';
  if (adequacao.length === 2) return 'Mestrado e Doutorado';
  if (adequacao.includes('mestrado') && adequacao.length === 1) return 'Apenas Mestrado';
  if (adequacao.includes('doutorado') && adequacao.length === 1) return 'Apenas Doutorado';
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
        </YAxis>
        <Tooltip />
        <Legend verticalAlign="top" />
        <Bar dataKey="Com Vínculo SBC" fill="#36A2EB" name="Com Vínculo SBC" />
        <Bar dataKey="Sem Vínculo SBC" fill="#FF6384" name="Sem Vínculo SBC" />
      </BarChart>
    </div>
  );
};

export default GraficoAdequacaoDefesa;