import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#FF6384', // vermelho claro
  '#36A2EB', // azul
];

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const color = COLORS[payload[0].payload.name === 'Predatório' ? 0 : 1];

    return (
      <div className="bg-cyan-100 p-2 rounded">
        <p className='flex items-center gap-2'>
          <span className='inline-block w-2 h-2' style={{ backgroundColor: color }}></span>
          "{name}": {value} ({percent}%)</p>
      </div>
    );
  }
  return null;
};

const GraficoPredatorios = ({ data }) => {
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

  return (
    <div className='max-w-lg'>
      <div className='flex justify-between items-center'>
        <h3 className="font-bold text-2xl">Panorama de Periódicos</h3>
        <p className='p-2 rounded-xl bg-red-100 text-red-800 font-bold'>Predatórios: {predatorio}</p>
      </div>
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
        <Tooltip content={<CustomTooltip total={todos.length} />} />
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