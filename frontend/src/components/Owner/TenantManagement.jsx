import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ChevronLeft, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { tenantService, pgService } from '../../services/api';

const TenantManagement = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [pgId]);

  const fetchData = async () => {
    try {
      const pgRes = await pgService.getById(pgId);
      const tenantsRes = await tenantService.getByPG(pgId);
      setPg(pgRes.data);
      setTenants(tenantsRes.data);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Tenants...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3rem' }}>
        <button 
          onClick={() => navigate('/owner-dashboard/pgs')}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: '600' }}
        >
          <ChevronLeft size={18} /> Back to Properties
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{pg?.pg_name} — Tenants</h1>
            <p className="text-muted">Manage active residents and bed assignments.</p>
          </div>
        </div>
      </header>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tenant Name</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Room / Bed</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Joined Date</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rent Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length > 0 ? tenants.map((tenant, i) => (
              <tr key={i} style={{ borderBottom: i === tenants.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{tenant.name || 'John Doe'}</div>
                  <div className="text-muted text-xs">{tenant.email}</div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Phone size={14} className="text-muted" /> {tenant.phone || '9876543210'}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ fontWeight: '600' }}>Room {tenant.room_number || 'N/A'}</div>
                   <div className="text-muted text-xs">Bed #{tenant.bed_number || 'N/A'}</div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                     <Calendar size={14} className="text-muted" /> {tenant.joining_date ? new Date(tenant.joining_date).toLocaleDateString() : 'N/A'}
                   </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <span style={{ 
                     padding: '4px 10px', 
                     borderRadius: '6px', 
                     fontSize: '0.7rem', 
                     fontWeight: '850',
                     textTransform: 'uppercase',
                     background: '#e1fcf2',
                     color: '#065f46',
                     border: '1px solid #059669'
                   }}>
                     Paid
                   </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                  <p>No active tenants found for this property.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantManagement;
