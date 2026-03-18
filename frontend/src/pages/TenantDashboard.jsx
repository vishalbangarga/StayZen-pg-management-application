import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyRoom from '../components/Tenant/MyRoom';
import RentManagement from '../components/Tenant/RentManagement';
import FoodMenu from '../components/Tenant/FoodMenu';
import Support from '../components/Tenant/Support';

const TenantOverview = () => (
  <div className="animate-soft">
    <div style={{ marginBottom: '3.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Welcome Home</h1>
      <p className="text-muted">Quick overview of your stay.</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      <div className="glass" style={{ gridColumn: 'span 8', padding: '2.5rem', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Room 102</h2>
        <p className="text-muted">Elite Living PG • Bed #03</p>
      </div>
      <div className="glass" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '32px' }}>
         <h2 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>₹8,000</h2>
         <p className="text-muted text-sm">Rent Due: Nov 05</p>
      </div>
    </div>
  </div>
);

const TenantDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<TenantOverview />} />
      <Route path="/room" element={<MyRoom />} />
      <Route path="/payments" element={<RentManagement />} />
      <Route path="/menu" element={<FoodMenu />} />
      <Route path="/complaints" element={<Support />} />
    </Routes>
  );
};

export default TenantDashboard;
