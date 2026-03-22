import React, { useState, useEffect } from 'react';
import { Bed, User, Shield, CheckCircle } from 'lucide-react';
import { tenantService } from '../../services/api';

const MyRoom = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: resData } = await tenantService.getMyRoomDetails();
        setData(resData);
      } catch (error) {
        console.error('Failed to fetch room details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Room Details...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>No room assignment found.</div>;

  return (
    <div className="animate-soft">
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>My Stay</h1>
        <p className="text-muted">Details about your current accommodation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
        <section>
          <div className="glass" style={{ padding: '3rem', borderRadius: '32px', marginBottom: '3rem', background: '#fff' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
               <Bed size={24} /> 
               <span style={{ fontWeight: '850', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Allotment</span>
             </div>
             <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Room {data.room_number}</h2>
             <p className="text-muted mb-8" style={{ fontSize: '1.1rem' }}>{data.pg_name} • Bed #{data.bed_number}</p>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
               <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '20px' }}>
                 <p className="text-xs text-muted mb-1 font-700">SHARING TYPE</p>
                 <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{data.room_type}</p>
               </div>
               <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '20px' }}>
                 <p className="text-xs text-muted mb-1 font-700">JOINED ON</p>
                 <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{data.joined_date}</p>
               </div>
             </div>
          </div>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Roommates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {data.roommates.map((roommate, i) => (
              <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', display: 'block' }}>{roommate.name}</span>
                    <span className="text-muted text-xs">Bed #{roommate.bed_id || 'N/A'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-muted">Phone</span>
                    <span style={{ fontWeight: '600' }}>{roommate.phone || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span className="text-muted">From</span>
                    <span style={{ fontWeight: '600' }}>{roommate.from || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--primary)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
              <Shield size={24} />
              <span style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Security & Rules</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                'Main gate closes at 10:30 PM',
                'No smoking inside rooms',
                'Register guests at reception',
                'Maintain cleanliness'
              ].map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: '500', opacity: '0.9' }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyRoom;
