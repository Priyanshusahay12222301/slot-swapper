import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container fade-in">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '20px',
          color: 'white',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          fontWeight: '700'
        }}>
          Slot Swapper
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          color: 'rgba(255, 255, 255, 0.9)', 
          maxWidth: '700px', 
          margin: '30px auto',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          The modern peer-to-peer time slot swapping platform. Create your events, make them swappable, 
          and exchange time slots with other users seamlessly with real-time updates.
        </p>
        
        {!isAuthenticated ? (
          <div style={{ marginTop: '40px' }}>
            <Link to="/signup" className="btn" style={{ marginRight: '15px', fontSize: '1.1rem' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn" style={{ fontSize: '1.1rem' }}>
              Login
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: '40px' }}>
            <Link to="/dashboard" className="btn" style={{ marginRight: '15px', fontSize: '1.1rem' }}>
              Go to Dashboard
            </Link>
            <Link to="/marketplace" className="btn" style={{ fontSize: '1.1rem' }}>
              Browse Marketplace
            </Link>
          </div>
        )}
        
        <div className="grid" style={{ marginTop: '80px', textAlign: 'left' }}>
          <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Manage Events</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Create and organize your time slots with an intuitive interface. Mark them as busy or swappable 
              based on your availability with one-click status changes.
            </p>
          </div>
          <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</div>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Smart Swapping</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Browse available slots from other users and request swaps instantly. Our system ensures 
              atomic transactions with MongoDB sessions for data consistency.
            </p>
          </div>
          <div className="card fade-in" style={{ animationDelay: '0.6s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📬</div>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Request Management</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Handle incoming swap requests and track your outgoing requests with real-time status updates 
              and instant notifications when swaps are accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;