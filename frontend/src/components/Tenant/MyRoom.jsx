import React, { useState, useEffect } from 'react';
import { Bed, User, Shield, CheckCircle } from 'lucide-react';
import { tenantService } from '../../services/api';

const MyRoom = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch the current tenant's room info
    // For now, using mock data that matches the design
    setTimeout(() => {
      setData({
        room_number: '102',
        bed_number: '03',
        pg_name: 'Elite Living PG',
        room_type: '3 Sharing',
        joined_date: 'Oct 12, 2025',
        rent: '8000',
        roommates: ['Rahul Sharma', 'Amit Kumar']
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Room Details...</div>;

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {data.roommates.map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="var(--primary)" />
                </div>
                <span style={{ fontWeight: '700' }}>{name}</span>
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
