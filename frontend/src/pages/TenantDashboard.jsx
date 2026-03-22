import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MyRoom from '../components/Tenant/MyRoom';
import RentManagement from '../components/Tenant/RentManagement';
import FoodMenu from '../components/Tenant/FoodMenu';
import Support from '../components/Tenant/Support';
import BookingStatus from '../components/Tenant/BookingStatus';
import PaymentPage from '../components/Tenant/PaymentPage';
import { useAuth } from '../context/AuthContext';
import { tenantService } from '../services/api';

const TenantOverview = ({ user, roomDetails }) => (
  <div className="animate-soft">
    <div style={{ marginBottom: '3.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Hello, {user?.name || 'Tenant'}</h1>
      <p className="text-muted">Welcome back to {roomDetails?.pg_name || 'your home'}.</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {roomDetails?.room_number ? `Room ${roomDetails.room_number}` : 'No Room Assigned'}
        </h2>
        <p className="text-muted">{roomDetails?.pg_name || 'Property'} • Bed #{roomDetails?.bed_number || '--'}</p>
      </div>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
         <h2 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>₹{roomDetails?.rent || '0'}</h2>
         <p className="text-muted text-sm">Monthly Rent Amount</p>
      </div>
    </div>
  </div>
);

const TenantDashboard = () => {
  const { user } = useAuth();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await tenantService.getMyRoomDetails();
        setRoomDetails(data);
      } catch (error) {
        console.error('Failed to fetch room details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDetails();
  }, [user]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;

  return (
    <Routes>
      <Route path="/" element={<TenantOverview user={user} roomDetails={roomDetails} />} />
      <Route path="/room" element={<MyRoom />} />
      <Route path="/bookings" element={<BookingStatus />} />
      <Route path="/payments" element={<RentManagement />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/menu" element={<FoodMenu />} />
      <Route path="/complaints" element={<Support />} />
    </Routes>
  );
};

export default TenantDashboard;
