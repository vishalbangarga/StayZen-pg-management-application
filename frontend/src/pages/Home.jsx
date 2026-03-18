import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pgService } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    sharingType: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    setLoading(true);
    try {
      const response = await pgService.getAll(filters);
      setPgs(response.data);
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPGs();
  };

  return (
    <div className="container animate-soft">
      <section style={{ 
        textAlign: 'center', 
        padding: '5rem 0 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <span style={{ 
          fontSize: '0.85rem', 
          fontWeight: '700', 
          color: 'var(--primary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          marginBottom: '1rem'
        }}>
          Premium Living Spaces
        </span>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '850',
          lineHeight: '1.1', 
          marginBottom: '1.5rem', 
          maxWidth: '900px',
          letterSpacing: '-0.04em'
        }}>
          Find your perfect <br/><span style={{ color: 'var(--primary)' }}>PG Accommodation</span>
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.25rem', 
          marginBottom: '3.5rem', 
          maxWidth: '650px'
        }}>
          Search across top locations with transparent pricing and real-time bed availability.
        </p>
        
        <form onSubmit={handleSearch} style={{ 
          background: 'var(--bg-card)', 
          padding: '12px', 
          borderRadius: '24px', 
          display: 'flex', 
          width: '100%', 
          maxWidth: '800px',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 2, padding: '0 12px', minWidth: '200px', borderRight: '1px solid var(--border)' }}>
            <MapPin size={20} color="var(--primary)" />
            <input 
              type="text" 
              placeholder="Enter Location..." 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '12px', fontWeight: '500' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 12px', minWidth: '150px' }}>
            <Filter size={18} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <select 
              value={filters.sharingType}
              onChange={(e) => setFilters({...filters, sharingType: e.target.value})}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '12px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-main)' }}
            >
              <option value="">Sharing Type</option>
              <option value="1">1 Sharing</option>
              <option value="2">2 Sharing</option>
              <option value="3">3 Sharing</option>
              <option value="4">4 Sharing</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 32px', borderRadius: '16px', height: '56px' }}>
            <Search size={20} />
            <span style={{ marginLeft: '8px' }}>Search</span>
          </button>
        </form>
      </section>

      <section style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Available PGs</h2>
            <p className="text-muted">Discover top-rated stays matching your criteria.</p>
          </div>
          <p className="text-sm font-600" style={{ color: 'var(--primary)' }}>{pgs.length} Properties found</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading PGs...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {pgs.length > 0 ? pgs.map((pg) => (
              <div key={pg.id} className="glass" style={{ borderRadius: '28px', padding: '1rem', background: 'var(--bg-card)' }}>
                <div style={{ 
                  height: '220px', 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
                  borderRadius: '20px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  {pg.images && pg.images[0] ? <img src={pg.images[0]} alt={pg.pg_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} /> : 'No Image Available'}
                </div>
                <div style={{ padding: '0 0.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{pg.pg_name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <MapPin size={14} />
                        <p className="text-xs font-500">{pg.location}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{pg.price || '8500'}</p>
                      <p className="text-muted text-xs">per month</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {pg.facilities && pg.facilities.slice(0, 3).map((f, i) => (
                      <span key={i} style={{ padding: '4px 10px', background: 'var(--bg-main)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)' }}>{f}</span>
                    ))}
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{ width: '100%', borderRadius: '12px', fontSize: '0.9rem' }}
                    onClick={() => navigate(`/pg/${pg.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                No PGs found for the selected criteria.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
;
