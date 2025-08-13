import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const GraficoAreaConhecimento = ({ data }) => {
  const todos = [...data.eventos, ...data.periodicos];

  // Contagem por área
  const contagem = {};
  todos.forEach(item => {
    item.areaPesquisa.forEach(area => {
      contagem[area] = (contagem[area] || 0) + 1;
    });
  });

  // Formato para Recharts
  const chartData = Object.entries(contagem).map(([area, valor]) => ({
    name: area,
    value: valor
  }));

  const COLORS = [
    '#FF6384', // vermelho claro
    '#36A2EB', // azul
    '#FFCE56', // amarelo
    '#4BC0C0', // verde água
    '#9966FF'  // roxo
  ];

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">Distribuição por Área de Conhecimento</h3>
      <PieChart width={600} height={400}>
        <Pie
          data={chartData}
          cx="55%" // move o gráfico para a esquerda para dar espaço para legenda
          cy="50%"
          innerRadius={70} // transforma em donut
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </div>
  );
};

export default GraficoAreaConhecimento;
