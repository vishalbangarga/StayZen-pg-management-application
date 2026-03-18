import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, LogIn, UserPlus, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '1rem 4rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Link to="/" style={{ 
        fontSize: '1.5rem', 
        fontWeight: '800', 
        color: 'var(--primary)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        letterSpacing: '-0.04em'
      }}>
        PG Manager
      </Link>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <button 
          onClick={toggleTheme}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link to="/" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Browse</Link>
        
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              to={user.role === 'owner' ? '/owner-dashboard' : '/tenant-dashboard'}
              style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <User size={18} />
              {user.name}
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-outline" 
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={16} />
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={16} />
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
