import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });
  const { apiCall } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await apiCall('/events/me');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      setError('Error loading events');
    }
    setLoading(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ title: '', startTime: '', endTime: '' });
        setShowForm(false);
        loadEvents();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Error creating event');
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const response = await apiCall(`/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        loadEvents();
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Error updating status');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await apiCall(`/events/${eventId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          loadEvents();
        } else {
          setError('Failed to delete event');
        }
      } catch (err) {
        setError('Error deleting event');
      }
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div className="loading" style={{ marginBottom: '20px' }}></div>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Loading your events...
        </p>
      </div>
    </div>
  );

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>📅 My Events Dashboard</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn"
        >
          {showForm ? '❌ Cancel' : '➕ Create New Event'}
        </button>
      </div>
      
      {error && <div className="error fade-in">⚠️ {error}</div>}

      {showForm && (
        <div className="card">
          <h3>Create Event</h3>
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn">Create Event</button>
          </form>
        </div>
      )}

      <h2>My Events ({events.length})</h2>
      
      {events.length === 0 ? (
        <p>No events yet. Create your first event!</p>
      ) : (
        <div className="grid">
          {events.map(event => (
            <div key={event._id} className={`event-card status-${event.status.toLowerCase()}`}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  marginBottom: '15px',
                  borderBottom: '2px solid #f0f0f0',
                  paddingBottom: '8px'
                }}>
                  {event.title}
                </h3>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    marginRight: '8px',
                    width: '20px'
                  }}>🕐</span>
                  <span style={{ fontWeight: '500', color: '#666', minWidth: '50px' }}>Start:</span>
                  <span style={{ color: '#2c3e50', fontWeight: '600' }}>{formatDateTime(event.startTime)}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  fontSize: '0.95rem'
                }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    marginRight: '8px',
                    width: '20px'
                  }}>🏁</span>
                  <span style={{ fontWeight: '500', color: '#666', minWidth: '50px' }}>End:</span>
                  <span style={{ color: '#2c3e50', fontWeight: '600' }}>{formatDateTime(event.endTime)}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '20px'
                }}>
                  <span style={{ fontWeight: '500', color: '#666', marginRight: '10px' }}>Status:</span>
                  <span className={`status-badge ${event.status.toLowerCase().replace('_', '-')} ${event.status === 'SWAP_PENDING' ? 'pulse' : ''}`}>
                    {event.status === 'SWAP_PENDING' ? '⏳ ' : event.status === 'SWAPPABLE' ? '🔄 ' : '🔒 '}
                    {event.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '15px',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '15px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                {event.status === 'BUSY' && (
                  <button 
                    onClick={() => handleStatusChange(event._id, 'SWAPPABLE')}
                    className="btn btn-success"
                    style={{
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}
                  >
                    Make Swappable
                  </button>
                )}
                {event.status === 'SWAPPABLE' && (
                  <button 
                    onClick={() => handleStatusChange(event._id, 'BUSY')}
                    className="btn"
                    style={{
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}
                  >
                    Mark Busy
                  </button>
                )}
                {event.status === 'SWAP_PENDING' && (
                  <span style={{ 
                    color: '#ffc107', 
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    padding: '8px 12px',
                    backgroundColor: '#fff9c4',
                    borderRadius: '6px',
                    border: '1px solid #ffeaa7'
                  }}>
                    ⏳ Swap in progress...
                  </span>
                )}
                <button 
                  onClick={() => handleDeleteEvent(event._id)}
                  className="btn btn-danger"
                  style={{
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;