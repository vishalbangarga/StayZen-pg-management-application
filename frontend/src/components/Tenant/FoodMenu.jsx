import React, { useState, useEffect } from 'react';
import { Utensils, Info, Check } from 'lucide-react';
import { menuService } from '../../services/api';

const FoodMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for menu
    setTimeout(() => {
      setMenu({
        breakfast: 'Masala Dosa, Sambar, Coconut Chutney & Tea',
        lunch: 'North Indian Thali: Roti, Paneer Butter Masala, Dal Makhani, Rice, Curd & Salad',
        dinner: 'Veg Pulao, Raita, Mixed Veg Curry & Papad'
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Today's Menu...</div>;

  return (
    <div className="animate-soft">
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Daily Menu</h1>
        <p className="text-muted">Healthy and delicious meals for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
        {[
          { title: 'Breakfast', time: '08:00 AM - 09:30 AM', items: menu.breakfast, color: '#f59e0b' },
          { title: 'Lunch', time: '01:00 PM - 02:30 PM', items: menu.lunch, color: '#10b981' },
          { title: 'Dinner', time: '08:00 PM - 09:30 PM', items: menu.dinner, color: '#3b82f6' }
        ].map((meal, i) => (
          <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: meal.color }}>
              <Utensils size={20} />
              <span style={{ fontWeight: '850', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{meal.title}</span>
            </div>
            <p className="text-xs text-muted mb-6" style={{ fontWeight: '600' }}>{meal.time}</p>
            <p style={{ fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.7', flex: 1 }}>{meal.items}</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <Check size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Nutritionally Balanced</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginTop: '4rem', padding: '2rem', borderRadius: '24px', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Info size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Special Request?</h4>
          <p className="text-muted text-sm">Please inform the warden 6 hours in advance if you want to skip a meal or have dietary restrictions.</p>
        </div>
        <button className="btn btn-outline" style={{ background: '#fff' }}>Contact Kitchen</button>
      </div>
    </div>
  );
};

export default FoodMenu;
