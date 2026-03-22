import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Home } from 'lucide-react';
import { bookingService } from '../../services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getOwnerBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Bookings...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Booking Requests</h1>
        <p className="text-muted">Review and manage interest from potential residents.</p>
      </header>

      <div className="glass" style={{ borderRadius: '28px', overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Visitor</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Property / Room</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map((b, i) => (
              <tr key={b.id} style={{ borderBottom: i === bookings.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700' }}>{b.user_name || `User ID: ${b.user_id.substring(0, 8)}...`}</div>
                      <div className="text-muted text-xs">Requested on {new Date(b.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                   <div style={{ fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <Home size={14} className="text-muted" /> {b.pg_name || `PG ID: ${b.pg_id.substring(0, 8)}...`}
                   </div>
                   <div className="text-muted text-sm">{b.room_type} Sharing Room</div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                   <div style={{ 
                     display: 'inline-flex', 
                     alignItems: 'center', 
                     gap: '6px', 
                     fontWeight: '800', 
                     fontSize: '0.75rem', 
                     textTransform: 'uppercase',
                     color: b.status === 'Approved' ? 'var(--success)' : b.status === 'Rejected' ? 'var(--error)' : 'var(--primary)'
                   }}>
                     {b.status === 'Approved' ? <CheckCircle size={14} /> : b.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                     {b.status}
                   </div>
                </td>
                <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                   {b.status === 'Pending' && (
                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                          onClick={() => handleStatusUpdate(b.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--error)' }}
                          onClick={() => handleStatusUpdate(b.id, 'Rejected')}
                        >
                          Reject
                        </button>
                     </div>
                   )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No booking requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
