import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title = "Pie Chart" }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  if (!data) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available for pie chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;