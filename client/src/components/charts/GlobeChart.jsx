import React, { useState } from 'react';

const GlobeChart = ({ data, title = "Global Data Visualization" }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="chart-placeholder">
          <p>No location data available for visualization</p>
        </div>
      </div>
    );
  }

  // Get color based on value
  const getMarkerColor = (value) => {
    if (value > 2000000) return '#dc2626'; // Red for high values
    if (value > 1000000) return '#f59e0b'; // Orange for medium values
    return '#10b981'; // Green for low values
  };

  // Get size based on value (scaled)
  const getMarkerSize = (value) => {
    const minSize = 8;
    const maxSize = 20;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const ratio = (value - minValue) / (maxValue - minValue);
    return minSize + (ratio * (maxSize - minSize));
  };

  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectToSVG = (lat, lng, width = 400, height = 200) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  return (
    <div className="chart-container globe-container">
      <h3>{title}</h3>
      <div className="world-map-container">
        <svg width="100%" height="250" viewBox="0 0 400 200" className="world-map-svg">
          {/* Simple world map background */}
          <rect width="400" height="200" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" rx="8"/>
          
          {/* Simplified continents (basic shapes) */}
          <path d="M50 50 L150 45 L180 80 L120 120 L40 90 Z" fill="#cbd5e1" opacity="0.5"/> {/* North America */}
          <path d="M80 120 L160 110 L150 180 L70 170 Z" fill="#cbd5e1" opacity="0.5"/> {/* South America */}
          <path d="M180 40 L280 35 L300 100 L250 130 L170 90 Z" fill="#cbd5e1" opacity="0.5"/> {/* Europe/Asia */}
          <path d="M200 100 L280 95 L270 160 L190 150 Z" fill="#cbd5e1" opacity="0.5"/> {/* Africa */}
          <path d="M320 120 L380 115 L375 180 L315 175 Z" fill="#cbd5e1" opacity="0.5"/> {/* Australia */}
          
          {/* Data points */}
          {data.map((point, index) => {
            const { x, y } = projectToSVG(point.lat, point.lng);
            const size = getMarkerSize(point.value);
            const color = getMarkerColor(point.value);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.8"
                  className="location-marker"
                  onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
                  style={{ cursor: 'pointer' }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={size + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.3"
                  className="location-marker-ring"
                />
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>Low Value (&lt;$1M)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Medium Value ($1M-$2M)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
            <span>High Value (&gt;$2M)</span>
          </div>
        </div>

        {/* Selected point details */}
        {selectedPoint !== null && (
          <div className="location-details">
            <h4>{data[selectedPoint].label}</h4>
            <p><strong>Value:</strong> {data[selectedPoint].value.toLocaleString()}</p>
            <p><strong>Location:</strong> {data[selectedPoint].lat.toFixed(2)}, {data[selectedPoint].lng.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobeChart;