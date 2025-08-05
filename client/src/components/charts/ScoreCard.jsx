import React from 'react';

const ScoreCard = ({ data, title = "Key Metrics" }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="chart-placeholder">
          <p>No data available for score card</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num) => {
    return '$' + formatNumber(num);
  };

  const getMetricCards = () => {
    const cards = [];
    const metricKeys = Object.keys(data).slice(0, 4); // Show top 4 metrics

    metricKeys.forEach((key, index) => {
      const metric = data[key];
      const isCurrency = key.toLowerCase().includes('revenue') || 
                        key.toLowerCase().includes('profit') || 
                        key.toLowerCase().includes('cost');
      
      cards.push(
        <div key={key} className="score-card-item">
          <div className="metric-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
          <div className="metric-value">
            {isCurrency ? formatCurrency(metric.average) : formatNumber(metric.average)}
          </div>
          <div className="metric-subtitle">Average</div>
          <div className="metric-details">
            <span>Total: {isCurrency ? formatCurrency(metric.total) : formatNumber(metric.total)}</span>
            <span>Count: {metric.count}</span>
          </div>
        </div>
      );
    });

    return cards;
  };

  return (
    <div className="chart-container score-card-container">
      <h3>{title}</h3>
      <div className="score-card-grid">
        {getMetricCards()}
      </div>
    </div>
  );
};

export default ScoreCard;