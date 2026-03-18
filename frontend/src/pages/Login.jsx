import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../services/firebase';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: updateAuthContext } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // 2. Get ID Token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Verify with Backend
      const response = await authService.login({ idToken });
      const userData = response.data;
      
      // 4. Update Context
      updateAuthContext(userData, idToken);
      
      // 5. Redirect based on role
      if (userData.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-soft" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', width: '100%', maxWidth: '440px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '2rem' }}>Welcome back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Enter your details to access your account.
        </p>

        {error && <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          <div style={{ textAlign: 'right', marginTop: '-0.75rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Forgot password?
            </Link>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', padding: '16px', borderRadius: '16px', fontWeight: '700' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          New here? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
