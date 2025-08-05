import React from 'react';

export const DebugPanel = ({ vessels, radarDots, mode }) => {
  const greenVessels = vessels.filter(v => v.type === 'cargo');
  const redVessels = vessels.filter(v => v.type === 'passenger');
  
  const greenLeader = greenVessels.find(v => v.role === 'leader');
  const redLeader = redVessels.find(v => v.role === 'leader');

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000,
        minWidth: '250px',
        border: '1px solid #00ff00'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        {mode} Debug
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#10b981' }}>Green Formation: {greenVessels.length}</span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#ef4444' }}>Red Formation: {redVessels.length}</span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        Radar Dots: {radarDots.length}
      </div>
      
      {greenLeader && (
        <div style={{ marginBottom: '5px', fontSize: '10px' }}>
          <span style={{ color: '#10b981' }}>Green Leader:</span> 
          ({greenLeader.position?.x?.toFixed(1)}, {greenLeader.position?.y?.toFixed(1)})
        </div>
      )}
      
      {redLeader && (
        <div style={{ marginBottom: '5px', fontSize: '10px' }}>
          <span style={{ color: '#ef4444' }}>Red Leader:</span> 
          ({redLeader.position?.x?.toFixed(1)}, {redLeader.position?.y?.toFixed(1)})
        </div>
      )}
      
      <div style={{ fontSize: '10px', opacity: 0.7 }}>
        Formation: Wedge
      </div>
    </div>
  );
}; 