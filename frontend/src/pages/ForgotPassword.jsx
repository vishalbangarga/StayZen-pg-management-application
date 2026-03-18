import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../services/firebase';
import { ChevronLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error('Reset error:', err);
      setError('Failed to send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-soft" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', width: '100%', maxWidth: '440px', background: 'var(--bg-card)' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ChevronLeft size={18} /> Back to Login
        </Link>

        {!success ? (
          <>
            <h2 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>Forgot Password?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>

            {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="text-sm mb-1" style={{ display: 'block', fontWeight: '600' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '16px', borderRadius: '16px', fontWeight: '700' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Check your email</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%', borderRadius: '16px' }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
