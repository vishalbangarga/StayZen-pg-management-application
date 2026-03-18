import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, LayoutGrid, Bed, Users } from 'lucide-react';
import { pgService } from '../../services/api';
import AddPGDialog from './AddPGDialog';
import { useNavigate } from 'react-router-dom';

const PGManagement = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const response = await pgService.getAll();
      setPgs(response.data);
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading PGs...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Management</h1>
          <p className="text-muted">Manage your property portfolio.</p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: '16px', padding: '14px 28px' }}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={18} /> Add Property
        </button>
      </header>

      <AddPGDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onRefresh={fetchPGs} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
        {pgs.length > 0 ? pgs.map((pg) => (
          <div key={pg.id} className="glass" style={{ borderRadius: '28px', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{pg.pg_name}</h3>
                  <p className="text-muted text-sm" style={{ fontWeight: '500' }}>{pg.location}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-main)', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <Edit size={16} />
                  </button>
                  <button style={{ padding: '8px', borderRadius: '10px', background: '#fee2e2', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                    <Trash size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    <Bed size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase' }}>Rooms</span>
                  </div>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>12</p>
                </div>
                <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '0.5rem' }}>
                    <Users size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase' }}>Tenants</span>
                  </div>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>34</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, borderRadius: '12px', fontSize: '0.9rem' }}
                  onClick={() => navigate(`/owner-dashboard/pgs/${pg.id}/rooms`)}
                >
                  Manage Rooms
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, borderRadius: '12px', fontSize: '0.9rem' }}
                  onClick={() => navigate(`/owner-dashboard/pgs/${pg.id}/tenants`)}
                >
                  View Tenants
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass" style={{ gridColumn: 'span 3', padding: '5rem', borderRadius: '32px', textAlign: 'center', border: '2px dashed var(--border)' }}>
             <LayoutGrid size={48} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
             <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No properties found</h3>
             <p className="text-muted mb-8">Start by adding your first PG property to manage rooms and tenants.</p>
             <button className="btn btn-primary">Add Your First PG</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PGManagement;
