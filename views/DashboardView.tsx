import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { DailyUsageData } from '../types';

export const DashboardView: React.FC = () => {
  // Mock data since we don't have a real backend
  const data: DailyUsageData[] = useMemo(() => [
    { day: 'Mon', tokens: 1250, images: 2 },
    { day: 'Tue', tokens: 3400, images: 5 },
    { day: 'Wed', tokens: 890, images: 1 },
    { day: 'Thu', tokens: 5600, images: 8 },
    { day: 'Fri', tokens: 4200, images: 4 },
    { day: 'Sat', tokens: 1000, images: 12 },
    { day: 'Sun', tokens: 2100, images: 3 },
  ], []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
       <div className="mb-8">
         <h2 className="text-3xl font-bold text-white mb-2">Usage Analytics</h2>
         <p className="text-zinc-400">Track your token consumption and generation metrics.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Usage Card */}
          <div className="bg-surface border border-zinc-800 p-6 rounded-2xl">
             <h3 className="text-lg font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Token Consumption
             </h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis 
                            dataKey="day" 
                            stroke="#52525b" 
                            tick={{fill: '#71717a', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#52525b" 
                            tick={{fill: '#71717a', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{stroke: '#3f3f46'}}
                        />
                        <Line type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Image Gen Card */}
           <div className="bg-surface border border-zinc-800 p-6 rounded-2xl">
             <h3 className="text-lg font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Images Generated
             </h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis 
                            dataKey="day" 
                            stroke="#52525b" 
                            tick={{fill: '#71717a', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#52525b" 
                            tick={{fill: '#71717a', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                            cursor={{fill: '#27272a'}}
                        />
                        <Bar dataKey="images" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Summary Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-xl">
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Total Tokens</p>
                <p className="text-2xl text-white font-mono mt-1">18,440</p>
            </div>
            <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-xl">
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Images Created</p>
                <p className="text-2xl text-white font-mono mt-1">35</p>
            </div>
             <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-xl">
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">API Cost (Est)</p>
                <p className="text-2xl text-white font-mono mt-1">$0.04</p>
            </div>
       </div>
    </div>
  );
};