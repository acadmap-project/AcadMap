import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const GraficoPredatorios = ({ data }) => {
  // Considera predatório se item.predatorio === true
  const todos = [...data.eventos, ...data.periodicos];

  let predatorio = 0;
  let naoPredatorio = 0;

  todos.forEach(item => {
    if (item.predatorio) {
      predatorio += 1;
    } else {
      naoPredatorio += 1;
    }
  });

  const chartData = [
    { name: 'Predatório', value: predatorio },
    { name: 'Não Predatório', value: naoPredatorio }
  ];

  const COLORS = [
    '#FF6384', // vermelho claro
    '#36A2EB'  // azul
  ];

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">Distribuição de Veículos Predatórios</h3>
      <PieChart width={600} height={400}>
        <Pie
          data={chartData}
          cx="55%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          // Removido o prop label para não mostrar porcentagem
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

export default GraficoPredatorios;