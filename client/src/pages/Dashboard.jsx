import React, { useState, useEffect } from 'react';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';
import ScatterChart from '../components/charts/ScatterChart';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import GlobeChart from '../components/charts/GlobeChart';
import ScoreCard from '../components/charts/ScoreCard';
import TextPlaceholder from '../components/charts/TextPlaceholder';
import { loadCSVFile, processDataForCharts } from '../utils/csvParser';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load CSV file from public directory
        const sampleDataPath = '/sample-data.csv';
        const data = await loadCSVFile(sampleDataPath);
        const processedData = processDataForCharts(data);
        setChartData(processedData);
      } catch (err) {
        setError('Failed to load dashboard data: ' + err.message);
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Data Dashboard</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Data Dashboard</h1>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Data Dashboard</h1>
        <p>Interactive visualization of business metrics and analytics</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Row 1: Score Cards and Text */}
        <div className="grid-item score-card-item">
          <ScoreCard 
            data={chartData?.scoreCard} 
            title="Key Performance Metrics" 
          />
        </div>
        
        <div className="grid-item text-item">
          <TextPlaceholder 
            title="Executive Summary"
            content={{
              summary: "This dashboard analyzes performance data from 20 companies across various industries and geographic locations.",
              keyFindings: [
                "Average revenue per company: $1.54M",
                "Technology and Aerospace sectors lead in profitability",
                "Global presence spans 15 countries across 5 continents",
                "Strong correlation between employee count and revenue"
              ],
              dataInfo: `Dashboard updated: ${new Date().toLocaleDateString()}`
            }}
          />
        </div>

        {/* Row 2: Bar Charts */}
        <div className="grid-item chart-item">
          <BarChart 
            data={chartData?.barChart} 
            title="Revenue by Category" 
          />
        </div>
        
        <div className="grid-item chart-item">
          <HorizontalBarChart 
            data={chartData?.horizontalBarChart} 
            title="Profit Analysis" 
          />
        </div>

        {/* Row 3: Pie Chart and Line Chart */}
        <div className="grid-item chart-item">
          <PieChart 
            data={chartData?.pieChart} 
            title="Industry Distribution" 
          />
        </div>
        
        <div className="grid-item chart-item">
          <LineChart 
            data={chartData?.lineChart} 
            title="Revenue Trend Over Time" 
          />
        </div>

        {/* Row 4: Map and Scatter Chart */}
        <div className="grid-item globe-item">
          <GlobeChart 
            data={chartData?.globeData} 
            title="Global Business Locations" 
          />
        </div>
        
        <div className="grid-item chart-item">
          <ScatterChart 
            data={chartData?.scatterChart} 
            title="Revenue vs Profit Correlation" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;