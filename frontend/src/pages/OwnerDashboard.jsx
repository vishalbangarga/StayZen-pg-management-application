import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PGManagement from '../components/Owner/PGManagement';
import RoomManagement from '../components/Owner/RoomManagement';
import TenantManagement from '../components/Owner/TenantManagement';
import ComplaintManagement from '../components/Owner/ComplaintManagement';
import MenuManagement from '../components/Owner/MenuManagement';
import BookingManagement from '../components/Owner/BookingManagement';
import AnalyticsDashboard from '../components/Owner/AnalyticsDashboard';

const OwnerOverview = () => (
  <div className="animate-soft">
    <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p className="text-muted">Welcome back. Here's your property overview.</p>
      </div>
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
      {[
        { label: 'Active PGs', value: '04' },
        { label: 'Total Rooms', value: '18' },
        { label: 'Occupancy', value: '82%' },
        { label: 'Revenue', value: '₹42k' },
      ].map((stat, i) => (
        <div key={i} className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '20px', background: 'var(--bg-card)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
          <div style={{ fontSize: '2rem', fontWeight: '850', color: 'var(--text-main)' }}>{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const OwnerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerOverview />} />
      <Route path="/pgs" element={<PGManagement />} />
      <Route path="/pgs/:pgId/rooms" element={<RoomManagement />} />
      <Route path="/pgs/:pgId/tenants" element={<TenantManagement />} />
      <Route path="/complaints" element={<ComplaintManagement />} />
      <Route path="/menu" element={<MenuManagement />} />
      <Route path="/bookings" element={<BookingManagement />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
    </Routes>
  );
};

export default OwnerDashboard;
