import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Requests = () => {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { apiCall } = useAuth();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await apiCall('/swaps/my-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError('Failed to load requests');
      }
    } catch (err) {
      setError('Error loading requests');
    }
    setLoading(false);
  };

  const handleResponse = async (requestId, action) => {
    try {
      const response = await apiCall(`/swaps/swap-response/${requestId}`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setTimeout(() => setSuccess(''), 3000);
        loadRequests(); // Refresh requests
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Error responding to request');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: '#ffc107',
      ACCEPTED: '#28a745',
      REJECTED: '#dc3545'
    };
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '4px',
        backgroundColor: colors[status] || '#6c757d',
        color: 'white',
        fontSize: '0.8rem'
      }}>
        {status}
      </span>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Swap Requests</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {/* Incoming Requests */}
      <div className="card">
        <h2>Incoming Requests ({requests.incoming.length})</h2>
        {requests.incoming.length === 0 ? (
          <p>No incoming requests.</p>
        ) : (
          <div>
            {requests.incoming.map(request => (
              <div key={request._id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '10px 0', 
                borderRadius: '4px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4>From: {request.fromUser?.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '15px 0' }}>
                      <div>
                        <h5>They want your slot:</h5>
                        <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                          <p><strong>{request.theirSlot?.title}</strong></p>
                          <p>{formatDateTime(request.theirSlot?.startTime)} - {formatDateTime(request.theirSlot?.endTime)}</p>
                        </div>
                      </div>
                      <div>
                        <h5>They offer their slot:</h5>
                        <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
                          <p><strong>{request.mySlot?.title}</strong></p>
                          <p>{formatDateTime(request.mySlot?.startTime)} - {formatDateTime(request.mySlot?.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
                
                {request.status === 'PENDING' && (
                  <div style={{ marginTop: '15px' }}>
                    <button 
                      onClick={() => handleResponse(request._id, 'accept')}
                      className="btn btn-success"
                      style={{ marginRight: '10px' }}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleResponse(request._id, 'reject')}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div className="card">
        <h2>Outgoing Requests ({requests.outgoing.length})</h2>
        {requests.outgoing.length === 0 ? (
          <p>No outgoing requests.</p>
        ) : (
          <div>
            {requests.outgoing.map(request => (
              <div key={request._id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '10px 0', 
                borderRadius: '4px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4>To: {request.toUser?.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '15px 0' }}>
                      <div>
                        <h5>You offered your slot:</h5>
                        <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
                          <p><strong>{request.mySlot?.title}</strong></p>
                          <p>{formatDateTime(request.mySlot?.startTime)} - {formatDateTime(request.mySlot?.endTime)}</p>
                        </div>
                      </div>
                      <div>
                        <h5>You want their slot:</h5>
                        <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                          <p><strong>{request.theirSlot?.title}</strong></p>
                          <p>{formatDateTime(request.theirSlot?.startTime)} - {formatDateTime(request.theirSlot?.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
                
                {request.status === 'PENDING' && (
                  <p style={{ color: '#6c757d', fontStyle: 'italic', marginTop: '10px' }}>
                    Waiting for {request.toUser?.name} to respond...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;