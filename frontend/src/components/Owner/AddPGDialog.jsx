import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { pgService } from '../../services/api';

const AddPGDialog = ({ isOpen, onClose, onRefresh, pg = null }) => {
  const [formData, setFormData] = useState({
    pg_name: pg?.pg_name || '',
    location: pg?.location || '',
    description: pg?.description || '',
    contact_number: pg?.contact_number || '',
    facilities: pg?.facilities || [],
    images: pg?.images || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when pg prop changes (e.g. when opening to edit a different PG)
  React.useEffect(() => {
    if (pg) {
      setFormData({
        pg_name: pg.pg_name,
        location: pg.location,
        description: pg.description,
        contact_number: pg.contact_number,
        facilities: pg.facilities || [],
        images: pg.images || []
      });
    } else {
      setFormData({
        pg_name: '',
        location: '',
        description: '',
        contact_number: '',
        facilities: [],
        images: []
      });
    }
  }, [pg, isOpen]);

  const availableFacilities = ['Wifi', 'AC', 'Power Backup', 'Food', 'Laundry', 'Parking'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (pg) {
        await pgService.update(pg.id, formData);
      } else {
        await pgService.create(formData);
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${pg ? 'update' : 'add'} PG`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass animate-soft" style={{ background: 'var(--bg-card)', borderRadius: '32px', width: '100%', maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{pg ? 'Edit' : 'Add New'} Property</h2>
            <p className="text-muted text-xs">Fill in the details to list your PG.</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-main)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </header>

        {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontWeight: '600', fontSize: '0.85rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="text-xs font-800" style={{ display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>PG Name</label>
              <input name="pg_name" placeholder="Elite Living PG" required value={formData.pg_name} onChange={handleChange} style={{ padding: '12px', height: '48px' }} />
            </div>
            <div>
              <label className="text-xs font-800" style={{ display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Location / Area</label>
              <input name="location" placeholder="Indiranagar, Bangalore" required value={formData.location} onChange={handleChange} style={{ padding: '12px', height: '48px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="text-xs font-800" style={{ display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Contact Number</label>
              <input name="contact_number" placeholder="+91 98765 43210" required value={formData.contact_number} onChange={handleChange} style={{ padding: '12px', height: '48px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
               <div style={{ padding: '0 1rem', border: '2px dashed var(--border)', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px' }}>
                  <Upload size={16} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs font-850 text-muted uppercase tracking-wider">Images</span>
               </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-800" style={{ display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Description</label>
            <textarea name="description" placeholder="Describe your property..." value={formData.description} onChange={handleChange} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--border)', width: '100%', minHeight: '90px', maxHeight: '140px', fontSize: '0.95rem', lineHeight: '1.6' }} />
          </div>

          <div>
            <label className="text-xs font-800" style={{ display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Facilities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableFacilities.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    border: '1.5px solid',
                    borderColor: formData.facilities.includes(f) ? 'var(--primary)' : 'var(--border)',
                    background: formData.facilities.includes(f) ? 'var(--primary)' : 'transparent',
                    color: formData.facilities.includes(f) ? '#fff' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {formData.facilities.includes(f) && <Check size={12} />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '14px', borderRadius: '14px', fontWeight: '800', marginTop: '0.5rem', width: '100%' }}
            disabled={loading}
          >
            {loading ? (pg ? 'Updating...' : 'Creating...') : (pg ? 'Update Property' : 'Create Property')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPGDialog;
