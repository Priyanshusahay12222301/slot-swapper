import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div className="loading" style={{ marginBottom: '20px' }}></div>
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
        {message}
      </p>
    </div>
  );
};

export default Loading;