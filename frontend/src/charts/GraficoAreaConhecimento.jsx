import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, total }) => {
  console.log(payload, active, total)
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-gray-300 p-2 rounded">
        <p>{name}</p>
        <p>
          Veículos: {value} ({percent}%)
        </p>
      </div>
    );
  }
  return null;
};

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
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

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
        <Tooltip content={<CustomTooltip />} position={{ x: 400, y: 20 }} animationDuration={0} total={total} />
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
