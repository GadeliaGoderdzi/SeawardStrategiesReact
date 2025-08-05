import React from 'react';

const TextPlaceholder = ({ title = "Data Insights", content }) => {
  const defaultContent = {
    summary: "This dashboard provides comprehensive insights into business performance metrics.",
    keyFindings: [
      "Revenue trends show consistent growth across quarters",
      "Technology sector leads in profitability ratios",
      "Geographic distribution spans multiple continents",
      "Employee productivity correlates with company performance"
    ],
    dataInfo: "Data refreshed automatically from CSV sources. Last updated: " + new Date().toLocaleDateString()
  };

  const displayContent = content || defaultContent;

  return (
    <div className="chart-container text-placeholder-container">
      <h3>{title}</h3>
      <div className="text-content">
        <div className="summary-section">
          <h4>Summary</h4>
          <p>{displayContent.summary}</p>
        </div>
        
        {displayContent.keyFindings && (
          <div className="findings-section">
            <h4>Key Findings</h4>
            <ul>
              {displayContent.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="info-section">
          <p className="data-info">{displayContent.dataInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default TextPlaceholder;