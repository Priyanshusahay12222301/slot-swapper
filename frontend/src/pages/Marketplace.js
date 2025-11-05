import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
  const [swappableEvents, setSwappableEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { apiCall } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load swappable events from others
      const swappableResponse = await apiCall('/events/swappable');
      if (swappableResponse.ok) {
        const swappableData = await swappableResponse.json();
        setSwappableEvents(swappableData);
      }

      // Load my swappable events
      const myResponse = await apiCall('/events/me');
      if (myResponse.ok) {
        const myData = await myResponse.json();
        setMyEvents(myData.filter(event => event.status === 'SWAPPABLE'));
      }
    } catch (err) {
      setError('Error loading marketplace data');
    }
    setLoading(false);
  };

  const handleRequestSwap = (theirSlot) => {
    setSelectedSlot(theirSlot);
    setShowRequestModal(true);
  };

  const submitSwapRequest = async (mySlotId) => {
    try {
      const response = await apiCall('/swaps/swap-request', {
        method: 'POST',
        body: JSON.stringify({
          mySlotId: mySlotId,
          theirSlotId: selectedSlot._id
        })
      });
      
      if (response.ok) {
        setSuccess('Swap request sent successfully!');
        setShowRequestModal(false);
        setSelectedSlot(null);
        setTimeout(() => setSuccess(''), 3000);
        loadData(); // Refresh data
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Error sending swap request');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container fade-in">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🏪 Marketplace - Available Slots</h1>
      
      {error && <div className="error fade-in">⚠️ {error}</div>}
      {success && <div className="success fade-in">✅ {success}</div>}
      
      {swappableEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ marginBottom: '15px' }}>No Available Slots</h3>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            No swappable slots available at the moment. Check back later or encourage others to make their slots swappable!
          </p>
        </div>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
            🔄 Available Slots ({swappableEvents.length})
          </h2>
          <div className="grid">
            {swappableEvents.map(event => (
              <div key={event._id} className="event-card status-swappable">
                <h3>{event.title}</h3>
                <p><strong>Owner:</strong> {event.owner?.name}</p>
                <p><strong>Start:</strong> {formatDateTime(event.startTime)}</p>
                <p><strong>End:</strong> {formatDateTime(event.endTime)}</p>
                <button 
                  onClick={() => handleRequestSwap(event)}
                  className="btn btn-success"
                  disabled={myEvents.length === 0}
                >
                  Request Swap
                </button>
                {myEvents.length === 0 && (
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
                    You need at least one swappable slot to request swaps
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Swap Request Modal */}
      {showRequestModal && selectedSlot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', margin: '20px' }}>
            <h3>Request Swap</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', margin: '10px 0' }}>
              <h4>Their Slot:</h4>
              <p><strong>{selectedSlot.title}</strong></p>
              <p>{formatDateTime(selectedSlot.startTime)} - {formatDateTime(selectedSlot.endTime)}</p>
              <p>Owner: {selectedSlot.owner?.name}</p>
            </div>
            
            <h4>Choose your slot to offer:</h4>
            {myEvents.length === 0 ? (
              <p>You don't have any swappable slots. Go to your dashboard and make a slot swappable first.</p>
            ) : (
              <div>
                {myEvents.map(event => (
                  <div 
                    key={event._id} 
                    style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px', 
                      margin: '10px 0', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa'
                    }}
                    onClick={() => submitSwapRequest(event._id)}
                  >
                    <h4>{event.title}</h4>
                    <p>{formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}</p>
                    <button className="btn" style={{ marginTop: '10px' }}>
                      Offer This Slot
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => {
                setShowRequestModal(false);
                setSelectedSlot(null);
              }}
              className="btn btn-danger"
              style={{ marginTop: '15px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;