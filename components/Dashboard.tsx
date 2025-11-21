import React from 'react';
import { WikiData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  data: WikiData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  // Calculate Sentiment Distribution
  const sentimentData = data.entries.map(e => ({
    name: e.title.substring(0, 15) + '...',
    sentiment: e.sentimentScore
  }));

  // Calculate Category Distribution
  const categoryCount: {[key: string]: number} = {};
  data.entries.forEach(e => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
  });
  
  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Content Sentiment Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-20} textAnchor="end" height={50}/>
              <YAxis hide />
              <Tooltip 
                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}}
                cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="sentiment" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Topic Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-4 text-xs text-slate-600 space-y-1">
             {pieData.map((entry, index) => (
               <div key={index} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                 <span>{entry.name} ({entry.value})</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};