import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScatterChart = ({ data, title = "Scatter Chart" }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!data) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available for scatter chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterChart;