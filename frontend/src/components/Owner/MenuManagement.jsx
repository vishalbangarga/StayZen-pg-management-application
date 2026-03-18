import React, { useState, useEffect } from 'react';
import { Utensils, Save, Plus, Trash } from 'lucide-react';
import { menuService } from '../../services/api';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for owner-side menus
    setTimeout(() => {
      setMenus([
        { id: 1, pg: 'Elite Living PG', breakfast: 'Masala Dosa', lunch: 'North Thali', dinner: 'Veg Pulao' },
        { id: 2, pg: 'Comfort Stay', breakfast: 'Idli Vada', lunch: 'South Thali', dinner: 'Chapati Kurma' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Menus...</div>;

  return (
    <div className="animate-soft">
      <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>Food Menus</h1>
          <p className="text-muted">Manage daily meals for all your properties.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
        {menus.map(m => (
          <div key={m.id} className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: '#fff' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={20} color="var(--primary)" />
              </div>
              {m.pg}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                  <label className="text-xs font-850 uppercase text-muted mb-2 block">Breakfast</label>
                  <input value={m.breakfast} onChange={() => {}} />
               </div>
               <div>
                  <label className="text-xs font-850 uppercase text-muted mb-2 block">Lunch</label>
                  <input value={m.lunch} onChange={() => {}} />
               </div>
               <div>
                  <label className="text-xs font-850 uppercase text-muted mb-2 block">Dinner</label>
                  <input value={m.dinner} onChange={() => {}} />
               </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', borderRadius: '16px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
               <Save size={18} /> Save Menu Update
            </button>
          </div>
        ))}

        <div className="glass" style={{ borderRadius: '32px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
           <Plus size={48} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
           <p className="text-muted font-600 mb-6">Create menu for a new property</p>
           <button className="btn btn-outline">Select Property</button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
