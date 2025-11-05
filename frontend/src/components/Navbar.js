import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          textDecoration: 'none'
        }}>
          Slot Swapper
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ 
              marginRight: '20px', 
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              👋 Hello, {user?.name}
            </span>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/marketplace">🏪 Marketplace</Link>
            <Link to="/requests">📨 Requests</Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-danger" 
              style={{ marginLeft: '15px', padding: '8px 16px', fontSize: '12px' }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">🔑 Login</Link>
            <Link to="/signup">📝 Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;