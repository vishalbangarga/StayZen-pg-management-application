import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Home, IndianRupee } from 'lucide-react';

const AnalyticsDashboard = () => {
  const data = [
    { name: 'Elite Living', occupancy: 85, revenue: 45000 },
    { name: 'Comfort Stay', occupancy: 70, revenue: 32000 },
    { name: 'City PG', occupancy: 95, revenue: 58000 },
    { name: 'Student Hub', occupancy: 60, revenue: 21000 },
  ];

  const COLORS = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Analytics & Insights</h1>
        <p className="text-muted">Real-time performance metrics across your properties.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Avg Occupancy', value: '78%', icon: <Users size={20} />, color: '#1E3A8A' },
          { label: 'Total Revenue', value: '₹1.56L', icon: <IndianRupee size={20} />, color: '#10B981' },
          { label: 'Growth', value: '+12%', icon: <TrendingUp size={20} />, color: '#3B82F6' },
          { label: 'Total PGs', value: '04', icon: <Home size={20} />, color: '#6366F1' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-muted text-xs font-700 uppercase" style={{ marginBottom: '4px' }}>{stat.label}</p>
            <div style={{ fontSize: '1.75rem', fontWeight: '850', color: 'var(--text-main)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Revenue by Property</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Occupancy Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="occupancy"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
