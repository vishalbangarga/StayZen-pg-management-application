import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  Bed, 
  Users, 
  Menu as MenuIcon, 
  CreditCard, 
  MessageSquare,
  Settings,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const ownerLinks = [
    { name: 'Dashboard', path: '/owner-dashboard', icon: <BarChart3 size={20} /> },
    { name: 'My PGs', path: '/owner-dashboard/pgs', icon: <Home size={20} /> },
    { name: 'Analytics', path: '/owner-dashboard/analytics', icon: <TrendingUp size={20} /> },
    { name: 'Bookings', path: '/owner-dashboard/bookings', icon: <Calendar size={20} /> },
    { name: 'Food Menu', path: '/owner-dashboard/menu', icon: <MenuIcon size={20} /> },
    { name: 'Complaints', path: '/owner-dashboard/complaints', icon: <MessageSquare size={20} /> },
  ];

  const tenantLinks = [
    { name: 'Dashboard', path: '/tenant-dashboard', icon: <BarChart3 size={20} /> },
    { name: 'My Room', path: '/tenant-dashboard/room', icon: <Bed size={20} /> },
    { name: 'Payments', path: '/tenant-dashboard/payments', icon: <CreditCard size={20} /> },
    { name: 'Food Menu', path: '/tenant-dashboard/menu', icon: <MenuIcon size={20} /> },
    { name: 'Complaints', path: '/tenant-dashboard/complaints', icon: <MessageSquare size={20} /> },
  ];

  const links = role === 'owner' ? ownerLinks : tenantLinks;

  return (
    <aside style={{
      width: '260px',
      height: 'calc(100vh - 64px)',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      position: 'fixed',
      left: 0,
      top: '64px',
    }}>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            background: isActive ? 'var(--border)' : 'transparent',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          })}
        >
          {link.icon}
          {link.name}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
