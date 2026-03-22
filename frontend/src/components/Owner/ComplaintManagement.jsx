import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Clock, Filter, Search } from 'lucide-react';
import { complaintService, pgService } from '../../services/api';
import { db, onSnapshot, collection, query, where, orderBy } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const ComplaintManagement = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const setupListener = async () => {
      try {
        // 1. Get all PG IDs owned by this user
        // Note: For now we fetch all and filter by owner_id if possible,
        // or just use the pgIds from the existing PGs.
        const { data: pgs } = await pgService.getAll();
        const ownedPgIds = pgs
          .filter(pg => pg.owner_id === user.uid)
          .map(pg => pg.id);

        if (ownedPgIds.length === 0) {
          setComplaints([]);
          setLoading(false);
          return;
        }

        // 2. Setup real-time listener for complaints in these PGs
        // Note: Firestore 'in' queries are limited to 30 items
        const q = query(
          collection(db, 'complaints'),
          where('pg_id', 'in', ownedPgIds)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const complaintsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort on client side to avoid index requirement
          complaintsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setComplaints(complaintsData);
          setLoading(false);
        }, (error) => {
          console.error('Firestore listener error:', error);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Failed to setup complaints listener:', error);
        setLoading(false);
      }
    };

    let unsubscribePromise = setupListener();
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [user?.uid]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'var(--success)';
      case 'in progress': return 'var(--primary)';
      default: return 'var(--error)';
    }
  };

  const handleResolve = async (id) => {
    try {
      await complaintService.resolve(id);
      // No need to re-fetch, onSnapshot will handle it
    } catch (error) {
      console.error('Failed to resolve complaint:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Complaints...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Complaints</h1>
          <p className="text-muted">Manage and resolve resident issues across your properties.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input placeholder="Search complaints..." style={{ paddingLeft: '44px', borderRadius: '14px', width: '280px' }} />
           </div>
           <button className="btn btn-outline" style={{ borderRadius: '14px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Filter size={18} /> Filter
           </button>
        </div>
      </header>

      <div className="glass" style={{ borderRadius: '28px', overflow: 'hidden', background: 'var(--bg-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tenant / Property</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Type & Description</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i === complaints.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ fontWeight: '700' }}>{c.tenant_name || 'Anonymous'}</div>
                  <div className="text-muted text-xs">{c.pg_name || 'Unknown PG'}</div>
                </td>
                <td style={{ padding: '1.5rem 2rem', maxWidth: '300px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '4px', display: 'block' }}>{c.type || 'General'}</span>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{c.description}</div>
                </td>
                <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1.5rem 2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.8rem', color: getStatusColor(c.status) }}>
                     {c.status === 'resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                     {c.status}
                   </div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                     {c.status !== 'resolved' && (
                       <button 
                          onClick={() => handleResolve(c.id)}
                          className="btn btn-primary" 
                          style={{ borderRadius: '10px', fontSize: '0.8rem', padding: '8px 16px' }}
                        >
                          Resolve
                        </button>
                     )}
                     <button 
                        onClick={() => alert(`Reporting issue: ${c.description}\nOwner will be notified.`)}
                        className="btn btn-outline" 
                        style={{ borderRadius: '10px', fontSize: '0.8rem', padding: '8px 16px', color: 'var(--error)', borderColor: 'var(--error)' }}
                      >
                        Report
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintManagement;
