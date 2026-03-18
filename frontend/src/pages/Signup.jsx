import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { auth, createUserWithEmailAndPassword } from '../services/firebase';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tenant',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create user in Firebase Auth (Client Side)
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // 2. Prepare metadata for backend
      const userData = {
        uid: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      };

      // 3. Save additional info in Firestore via backend
      await authService.register(userData);

      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-soft" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '4rem 0' }}>
      <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', width: '100%', maxWidth: '480px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '2rem' }}>Join PGM</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Join the modern property management ecosystem.
        </p>
        
        {error && <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)' }}>Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)' }}>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="+91..." 
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)' }}>I want to sign up as</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ fontWeight: '500' }}>
              <option value="tenant">A Tenant (Looking for a PG)</option>
              <option value="owner">A Property Owner (Manage PGs)</option>
            </select>
          </div>
          <div>
            <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', padding: '16px', borderRadius: '16px', fontWeight: '700' }}
            disabled={loading}
          >
            {loading ? 'Creating your account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Sign in instead</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
