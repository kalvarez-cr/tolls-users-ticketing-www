import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UseApiCall } from 'hooks/useApiCall';




const BarChartComponent = () => {
  const { useGet } = UseApiCall();
  const { data, isLoading } = useGet({
    queryKey: 'getBarChart',
    url: '/dashboard/transit_recharge_graph/',
  });

   
    return (
      
        <>
        {!isLoading ? 
        
        <div className='flex flex-col p-6 overflow-x-scroll rounded-xl shadow-md bg-[#fff] bg-opacity-100 '>
        <p className='mb-6 text-gray-500 text-center'>Recarga vs consumo</p>
        <BarChart
          width={600}
          height={250}
          data={data?.data?.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x_axis" />
          <YAxis dataKey="Recarga" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Recarga" fill="#8884d8" />
          <Bar dataKey="Transito" fill="#82ca9d" />
         
        </BarChart>
        </div>
        :
          
<div className="flex flex-col p-6 rounded-xl shadow-md bg-white ">
          <h2 className="mb-6 text-lg text-black font-bold">Recarga vs consumo</h2>
       
          
          <div className="flex flex-row justify-center my-12">
            <div className="w-80 h-80  bg-gray-300  animate-pulse" />
          </div>
          </div>

        
        }
        </>
     
    );
  
}
 export default BarChartComponent