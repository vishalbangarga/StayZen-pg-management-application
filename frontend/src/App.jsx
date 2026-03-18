import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PGDetails from './pages/PGDetails';
import ForgotPassword from './pages/ForgotPassword';
import OwnerDashboard from './pages/OwnerDashboard';
import TenantDashboard from './pages/TenantDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import './index.css';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <div className="app-container">
      <Navbar />
      <div className="layout-body">
        {user && isDashboard && <Sidebar role={user.role} />}
        <main className={isDashboard ? 'main-with-sidebar' : 'main-full'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pg/:id" element={<PGDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/owner-dashboard/*" element={<OwnerDashboard />} />
            <Route path="/tenant-dashboard/*" element={<TenantDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
