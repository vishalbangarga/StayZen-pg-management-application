import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { complaintService } from '../../services/api';

const Support = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await complaintService.getByUser();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;
    try {
      await complaintService.create({ 
        title: 'Tenant Complaint', 
        description: newComplaint,
        type: 'General'
      });
      setNewComplaint('');
      // Re-fetch complaints
      const { data } = await complaintService.getByUser();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Support Tickets...</div>;

  return (
    <div className="animate-soft">
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Support</h1>
        <p className="text-muted">Raise a ticket or track your existing complaints.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
        <section>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Active Tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {complaints.map(c => (
              <div key={c.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'var(--bg-card)', borderLeft: `6px solid ${c.status === 'resolved' ? 'var(--success)' : c.status === 'in progress' ? 'var(--primary)' : 'var(--error)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="text-xs font-850 uppercase text-muted tracking-wider">{c.type || 'General'}</span>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '4px' }}>{c.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: c.status === 'resolved' ? 'var(--success)' : 'var(--text-main)' }}>
                      {c.status === 'resolved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      {c.status}
                    </div>
                    <span className="text-xs text-muted">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Need Help?</h3>
            <p className="text-muted text-sm mb-8">Describe your issue below and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit}>
              <textarea 
                placeholder="What seems to be the problem?" 
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                style={{ 
                  width: '100%', 
                  minHeight: '120px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  marginBottom: '1.5rem',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem'
                }}
              />
              <button className="btn btn-primary" style={{ width: '100%', borderRadius: '14px', padding: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Send size={18} /> Submit Ticket
              </button>
            </form>

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                 <AlertCircle size={20} />
               </div>
               <div>
                  <p className="text-xs font-700 uppercase">Emergency?</p>
                  <p className="text-sm font-600">+91 98765 43210</p>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Support;
