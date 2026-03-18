import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { pgService } from '../../services/api';

const AddPGDialog = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    pg_name: '',
    location: '',
    description: '',
    contact_number: '',
    facilities: [],
    images: [] // Placeholder for image URLs
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await pgService.create(formData);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add PG');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass animate-soft" style={{ background: 'var(--bg-card)', borderRadius: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Add New Property</h2>
            <p className="text-muted text-sm">Fill in the details to list your PG.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </header>

        {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="text-sm font-700" style={{ display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PG Name</label>
            <input name="pg_name" placeholder="Elite Living PG" required value={formData.pg_name} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-700" style={{ display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location / Area</label>
            <input name="location" placeholder="Indiranagar, Bangalore" required value={formData.location} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-700" style={{ display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</label>
            <input name="contact_number" placeholder="+91 98765 43210" required value={formData.contact_number} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-700" style={{ display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
            <textarea name="description" placeholder="Describe your property..." value={formData.description} onChange={handleChange} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', minHeight: '100px', fontFamily: 'inherit' }} />
          </div>

          <div>
            <label className="text-sm font-700" style={{ display: 'block', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facilities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {availableFacilities.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '10px', 
                    fontSize: '0.85rem', 
                    fontWeight: '600',
                    border: '1px solid',
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
                  {formData.facilities.includes(f) && <Check size={14} />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '20px', textAlign: 'center', cursor: 'pointer' }}>
             <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
             <p className="text-sm font-600 text-muted">Upload Property Images</p>
             <p className="text-xs text-muted">Drag & drop or click to browse</p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '16px', borderRadius: '16px', fontWeight: '700', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Property...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPGDialog;
