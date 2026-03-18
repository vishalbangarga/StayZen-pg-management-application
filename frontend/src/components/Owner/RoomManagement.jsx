import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Bed, Trash, ChevronLeft, Check } from 'lucide-react';
import { roomService, pgService } from '../../services/api';

const RoomManagement = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_type: '2',
    price_per_bed: ''
  });

  useEffect(() => {
    fetchData();
  }, [pgId]);

  const fetchData = async () => {
    try {
      const pgRes = await pgService.getById(pgId);
      const roomsRes = await roomService.getByPG(pgId);
      setPg(pgRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error fetching room data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.create({ ...newRoom, pg_id: pgId });
      setIsAdding(false);
      setNewRoom({ room_number: '', room_type: '2', price_per_bed: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Rooms...</div>;

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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{pg?.pg_name} — Rooms</h1>
            <p className="text-muted">Manage rooms and bed configurations.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={18} /> Add Room
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '3rem', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Room</h3>
          <form onSubmit={handleAddRoom} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', alignItems: 'flex-end' }}>
            <div>
              <label className="text-sm font-700 mb-1" style={{ display: 'block' }}>Room Number</label>
              <input 
                placeholder="e.g. 101" 
                required 
                value={newRoom.room_number} 
                onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-700 mb-1" style={{ display: 'block' }}>Sharing (Beds)</label>
              <select value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}>
                <option value="1">1 Sharing</option>
                <option value="2">2 Sharing</option>
                <option value="3">3 Sharing</option>
                <option value="4">4 Sharing</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-700 mb-1" style={{ display: 'block' }}>Price per Bed</label>
              <input 
                type="number" 
                placeholder="₹" 
                required 
                value={newRoom.price_per_bed} 
                onChange={e => setNewRoom({...newRoom, price_per_bed: e.target.value})} 
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Room</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {rooms.length > 0 ? rooms.map(room => (
          <div key={room.id} className="glass" style={{ padding: '2rem', borderRadius: '28px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Room {room.room_number}</h3>
                <p className="text-muted text-xs font-700 uppercase tracking-wider">{room.room_type} Sharing</p>
              </div>
              <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>₹{room.price_per_bed}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(parseInt(room.room_type))].map((_, i) => (
                   <div key={i} style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--success)' }}></div>
                ))}
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            No rooms added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
