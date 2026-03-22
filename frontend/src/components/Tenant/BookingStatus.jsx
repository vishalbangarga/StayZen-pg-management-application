import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Home, ArrowRight } from 'lucide-react';
import { bookingService } from '../../services/api';

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading My Bookings...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>My Bookings</h1>
        <p className="text-muted">Track the status of your room reservation requests.</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {bookings.length > 0 ? bookings.map((b) => (
          <div key={b.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                   <Home size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>{b.pg_name}</h3>
                  <p className="text-muted">{b.room_type} Sharing Room</p>
                  <p className="text-xs text-muted" style={{ marginTop: '8px' }}>Requested on {new Date(b.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontWeight: '800', 
                    fontSize: '0.85rem', 
                    textTransform: 'uppercase',
                    color: b.status === 'Approved' ? 'var(--success)' : b.status === 'Rejected' ? 'var(--error)' : 'var(--primary)',
                    background: b.status === 'Approved' ? '#f0fdf4' : b.status === 'Rejected' ? '#fef2f2' : '#f0f7ff',
                    padding: '8px 16px',
                    borderRadius: '12px'
                }}>
                    {b.status === 'Approved' ? <CheckCircle size={16} /> : b.status === 'Rejected' ? <XCircle size={16} /> : <Clock size={16} />}
                    {b.status}
                </div>

                {b.status === 'Approved' && (
                    <button 
                        className="btn btn-primary" 
                        style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => navigate('/tenant-dashboard/payment', { state: { booking: b } })}
                    >
                        Proceed to Payment <ArrowRight size={16} />
                    </button>
                )}
            </div>
          </div>
        )) : (
          <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '32px' }}>
             <p className="text-muted">You haven't made any booking requests yet.</p>
             <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>Explore PGs</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;
