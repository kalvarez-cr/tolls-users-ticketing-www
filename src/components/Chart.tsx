import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#F87171',
  '#FB923C',
  '#FACC15',
  '#34D399',
  '#22D3EE',
  '#60A5FA',
  '#F43F5E',
  '#C084FC',
  '#F472B6',
  '#2DD4BF',
  '#FDD7BB',
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Chart = ({ isLoadingPieChart, dataPieChart }) => {
  return (
    <>
      {!isLoadingPieChart ? (
        <div className="flex flex-col rounded-xl bg-[#fff] bg-opacity-100 p-6 shadow-md  ">
          <p className="mb-6 text-center text-gray-500">Tránsitos por peaje</p>
          <PieChart width={200} height={200}>
            <Pie
              data={dataPieChart?.data?.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="site_code"
            >
              {dataPieChart?.data?.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* <Legend
                      
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      margin-top={'10px'}
                    /> */}
            <Tooltip />
          </PieChart>
        </div>
      ) : (
        <div className="flex h-1/5 w-1/4 flex-col rounded-xl bg-gray-900 bg-opacity-20 p-6 shadow-md  ">
          <div className="h-52 w-52 animate-pulse rounded-full bg-white" />
        </div>
      )}
    </>
  );
};
export default Chart;
