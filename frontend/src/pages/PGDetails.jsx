import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Wifi, Wind, Zap, Coffee, Bed, Check, ChevronLeft } from 'lucide-react';
import { pgService, roomService, bookingService } from '../services/api';

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingRequest = async (roomType) => {
    setIsBooking(true);
    try {
      await bookingService.request({
        pg_id: id,
        room_type: roomType,
        message: `I am interested in a ${roomType} sharing room.`
      });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to send booking request. Please login first.');
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pgRes = await pgService.getById(id);
        const roomsRes = await roomService.getByPG(id);
        setPg(pgRes.data);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error('Error fetching PG details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading Details...</div>;
  if (!pg) return <div style={{ textAlign: 'center', padding: '10rem' }}>PG Not Found</div>;

  const facilityIcons = {
    'Wifi': <Wifi size={18} />,
    'AC': <Wind size={18} />,
    'Power Backup': <Zap size={18} />,
    'Food': <Coffee size={18} />,
  };

  return (
    <div className="container animate-soft" style={{ padding: '2rem 0 6rem' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: 'none', 
          border: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--text-muted)',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontWeight: '600'
        }}
      >
        <ChevronLeft size={20} /> Back to Search
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
        <div>
          <div style={{ 
            height: '450px', 
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
            borderRadius: '32px',
            marginBottom: '2.5rem',
            overflow: 'hidden'
          }}>
            {pg.images && pg.images[0] && <img src={pg.images[0]} alt={pg.pg_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{pg.pg_name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <MapPin size={18} />
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{pg.location}</span>
          </div>

          <section style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Facilities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {pg.facilities && pg.facilities.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--primary)' }}>{facilityIcons[f] || <Check size={18} />}</div>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{f}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>About this property</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
              {pg.description || 'Experience high-quality living with premium facilities and a vibrant community. Perfect for students and working professionals looking for a hassle-free stay.'}
            </p>
          </section>

          <section style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
               <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Resident Reviews</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: '800' }}>
                 ★ {pg.avg_rating ? pg.avg_rating.toFixed(1) : 'New'} ({pg.review_count || 0})
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               {[1, 2].map(i => (
                 <div key={i} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                       <div style={{ fontWeight: '700' }}>Happy Resident {i}</div>
                       <div style={{ color: '#F59E0B' }}>{'★'.repeat(5)}</div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>
                      "The facilities are great and the owner is very responsive. Highly recommended!"
                    </p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div>
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', position: 'sticky', top: '100px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Available Rooms</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {rooms.length > 0 ? rooms.map((room) => (
                <div key={room.id} style={{ 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  border: '1px solid var(--border)',
                  background: 'var(--bg-main)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bed size={18} color="var(--primary)" />
                      <span style={{ fontWeight: '700' }}>{room.room_type} Sharing</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.25rem' }}>₹{room.price_per_bed}</span>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem' }}
                        onClick={() => handleBookingRequest(room.room_type)}
                        disabled={isBooking}
                      >
                        {isBooking ? 'Sending...' : 'Book Bed'}
                      </button>
                    </div>
                  </div>
                  {bookingSuccess && (
                    <div style={{ background: '#f0fdf4', color: '#166534', padding: '8px', borderRadius: '8px', marginTop: '8px', fontSize: '0.7rem', fontWeight: '600', textAlign: 'center' }}>
                      Request Sent Successfully!
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span className="text-muted">Total Beds: {room.total_beds}</span>
                    <span style={{ color: 'var(--success)', fontWeight: '700' }}>Available</span>
                  </div>
                </div>
              )) : <p className="text-muted">No rooms listed yet.</p>}
            </div>
            
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '20px', border: '1px dashed var(--primary)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>Want to book a bed?</p>
              <button className="btn btn-primary" style={{ width: '100%', borderRadius: '14px', padding: '14px', fontWeight: '700' }}>
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetails;
